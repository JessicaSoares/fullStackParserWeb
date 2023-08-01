const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf-parse');
const { Pool } = require('pg');

// Conexão com o banco de dados PostgreSQL
const connectionString = 'postgres://postgres:senha@host:porta/postgres'; // Insira sua string de conexão aqui

// Diretório onde os arquivos PDF serão lidos
const pdfsDirectory = './faturas'; // Insira o caminho para a sua pasta aqui

// Cria uma pool de conexões com o banco de dados PostgreSQL
const pool = new Pool({
    connectionString: connectionString,
});

// Função que lê o conteúdo de um arquivo PDF e retorna uma promessa com os dados do PDF analisado
function readPDF(pdfPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(pdfPath, (error, data) => {
            if (error) {
                reject(error);
            } else {
                // Analisa o PDF utilizando a biblioteca PDFParser
                PDFParser(data)
                    .then((pdfData) => resolve(pdfData))
                    .catch((parseError) => reject(parseError));
                console.log(data.text); // Aqui você pode ver o texto extraído do PDF

            }
        });
    });
}

// Função que insere os dados extraídos do PDF na tabela "pdf_data" do PostgreSQL
function insertDataIntoPostgres(pdfFileName, data) {

    const faturatext = data.text;
    console.log(faturatext);

    const regexNumeroInstalacao = /Nº DA INSTALAÇÃO\s+(\d+)/;
    const matchesNumeroInstalacao = faturatext.match(regexNumeroInstalacao);
    const numeroCliente = matchesNumeroInstalacao ? matchesNumeroInstalacao[1] : null;
    console.log("Número do Cliente:", numeroCliente);
// Encontra o mês de referência e a data de vencimento no texto
    const meses = {
        JAN: 1, FEV: 2, MAR: 3, ABR: 4, MAI: 5, JUN: 6,
        JUL: 7, AGO: 8, SET: 9, OUT: 10, NOV: 11, DEZ: 12
    };
    const mesReferenciaRegex = /(\w{3}\/\d{2}\d{2})\s+(\d{2}\/\d{2}\/\d{4})/;
    const [, mesReferencia, dataVencimento] = faturatext.match(mesReferenciaRegex) ?? [0, 0, 0];      
    const mesReferenciaInt = meses[mesReferencia.substr(0, 3)];

    console.log("Mês de Referência (Inteiro):", mesReferenciaInt);
    console.log("Mês de Referência:", mesReferencia);
    console.log("Data de Vencimento:", dataVencimento);
    
    // Encontra o valor total na fatura
    const valorTotalRegex = /TOTAL\s+(\d+,\d+)/;
    const [, valorTotal] = faturatext.match(valorTotalRegex) ?? [0];
    console.log("Valor Total (R$):", valorTotal);

    const hasSpecialPattern = /nNwWnWnN/.test(faturatext);
    
    // mmedia de kwmes
    const regex = /kWh\/DiaDias[\s\S]+?\n[\s\S]+?\s+([\d.,]+)/;
    const matches = faturatext.match(regex);

    const kwmes = matches ? matches[1].replace(',', '.') : null;
    console.log("Média de KM/mês:", kwmes);

    // Encontra o nome do cliente após "Comprovante de Pagamento"
    const regexNomeCliente = hasSpecialPattern
      ? /nNwWnWnN\s+([\s\S]+?)(?=\n|$)/
      : /Comprovante de Pagamento\s+([\s\S]+?)(?=\n|$)/;
    
    const matchesNomeCliente = faturatext.match(regexNomeCliente);
    const nomeCliente = matchesNomeCliente ? matchesNomeCliente[1].trim() : null;
    console.log("Nome do Cliente:", nomeCliente);

    // Encontra a contribuição de Iluminação Pública Municipal na fatura
    const contribIlumPublicaRegex = /Contrib Ilum Publica Municipal\s+(\d+,\d+)/;
    const [, contribIlumPublica] = faturatext.match(contribIlumPublicaRegex) ?? [0];
    console.log("Contribuição Iluminação Pública Municipal (R$):", contribIlumPublica);
    
    // Encontra os valores relacionados a 'Energia Elétrica'
    const regexEnergiaEletrica = /Energia Elétrica(\w+)\s+(\d+)\s+(\d+(?:,\d+)?)\s+(\d+(?:,\d+)?)/;
    const matchesEnergiaEletrica = faturatext.match(regexEnergiaEletrica);
    
    const unidade = matchesEnergiaEletrica ? matchesEnergiaEletrica[1] : 0;
    const quantidade = matchesEnergiaEletrica ? parseInt(matchesEnergiaEletrica[2]) : 0;
    const precoUnitario = matchesEnergiaEletrica ? parseFloat(matchesEnergiaEletrica[3].replace(',', '.')) : 0;
    const valor = matchesEnergiaEletrica ? parseFloat(matchesEnergiaEletrica[4].replace(',', '.')) : 0;
    
    console.log("Unidade:", unidade);
    console.log("Quantidade:", quantidade);
    console.log("Preço Unitário:", precoUnitario);
    console.log("Valor:", valor);
    
    // Encontra os valores relacionados a 'Energia Injetada HFP'
    const regexEnergiaInjetada = /Energia injetada HFP(\w+)\s+(\d+\.\d+)\s+(\d+,\d+)\s+([-\d,]+)\s+(\d+,\d+)/;
    const matchesEnergiaInjetada = faturatext.match(regexEnergiaInjetada);
    
    const unidadeInjetada = matchesEnergiaInjetada ? matchesEnergiaInjetada[1] : 0;
    const quantidadeInjetada = matchesEnergiaInjetada ? parseFloat(matchesEnergiaInjetada[2]) : 0;
    const precoUnitarioInjetada = matchesEnergiaInjetada ? parseFloat(matchesEnergiaInjetada[3].replace(',', '.')) : 0;
    const valorInjetada = matchesEnergiaInjetada ? parseFloat(matchesEnergiaInjetada[4].replace(',', '.')) : 0;
    const tarifaInjetada = matchesEnergiaInjetada ? parseFloat(matchesEnergiaInjetada[5].replace(',', '.')) : 0;
    
    console.log("Unidade injetada HFP:", unidadeInjetada);
    console.log("Quantidade injetada HFP:", quantidadeInjetada);
    console.log("Preço Unitário injetada HFP:", precoUnitarioInjetada);
    console.log("Valor da Energia injetada HFP:", valorInjetada);
    console.log("Tarifa injetada HFP:", tarifaInjetada);
    
    // Encontra os valores relacionados a 'Encomp. s/ ICMS'
    const regexEnCompICMS = /En comp. s\/ ICMS(\w+)\s+(\d+\.\d+)\s+(\d+,\d+)\s+([-\d,]+)\s+(\d+,\d+)/;
    const matchesEnCompICMS = faturatext.match(regexEnCompICMS);
    
    const unidadeICMS = matchesEnCompICMS ? matchesEnCompICMS[1] : 0;
    const quantidadeICMS = matchesEnCompICMS ? parseFloat(matchesEnCompICMS[2]) : 0;
    const precoUnitarioICMS = matchesEnCompICMS ? parseFloat(matchesEnCompICMS[3].replace(',', '.')) : 0;
    const valorICMS = matchesEnCompICMS ? parseFloat(matchesEnCompICMS[4].replace(',', '.')) : 0;
    const tarifaICMS = matchesEnCompICMS ? parseFloat(matchesEnCompICMS[5].replace(',', '.')) : 0;
    
    console.log("Unidade ICMS:", unidadeICMS);
    console.log("Quantidade ICMS:", quantidadeICMS);
    console.log("Preço Unitário ICMS:", precoUnitarioICMS);
    console.log("Valor da Energia ICMS:", valorICMS);
    console.log("Tarifa ICMS:", tarifaICMS);
    // Executa a consulta SQL para inserir os dados na tabela
    function convertToDate(dateString) {
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`);
    }
    
    // Function to convert a string in the format "xx,xx" to a JavaScript Number
    function convertToNumeric(numericString) {
        if (typeof numericString !== 'string') {
            return null; // Or you can return a default value, such as 0, depending on your use case
        }
    
        const cleanedString = numericString.replace(/[^\d.,-]/g, ''); // Remove any non-numeric characters except dots and hyphens
        return parseFloat(cleanedString.replace(',', '.'));
    }
    // ... Your existing code ...
    
    // Executa a consulta SQL para inserir os dados na tabela "faturas"
    pool.query(
        `INSERT INTO faturas (
            numero_cliente, mes_referencia, data_vencimento, valor_total, contrib_ilum_publica,
            unidade_eletr, quantidade_eletr, preco_unitario_eletr, valor_eletr,
            unidade_injetada, quantidade_injetada, preco_unitario_injetada, valor_injetada, tarifa_injetada,
            unidade_icms, quantidade_icms, preco_unitario_icms, valor_icms, tarifa_icms, nome_cliente, kw_mes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,$21)`,
        [
            convertToNumeric(numeroCliente),
            mesReferenciaInt, 
            convertToDate(dataVencimento), 
            convertToNumeric(valorTotal), 
            convertToNumeric(contribIlumPublica), 
            unidade, 
            parseFloat(quantidade), 
            parseFloat(precoUnitario), 
            parseFloat(valor),
            unidadeInjetada, 
            parseFloat(quantidadeInjetada), 
            parseFloat(precoUnitarioInjetada), 
            parseFloat(valorInjetada), 
            parseFloat(tarifaInjetada), 
            unidadeICMS, 
            parseFloat(quantidadeICMS), 
            parseFloat(precoUnitarioICMS), 
            parseFloat(valorICMS), 
            parseFloat(tarifaICMS),
            nomeCliente,
            kwmes
        ],
        (error) => {
            if (error) {
                console.error('Erro ao inserir dados no PostgreSQL:', error);
            } else {
                console.log(`Dados inseridos para o arquivo ${pdfFileName}`);
            }
        }
    );
}

// Função que lê todos os arquivos PDF de um diretório e insere seus dados no banco de dados
function readAllPDFsFromDirectory(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error('Erro ao ler a pasta:', err);
            return;
        }

        // Filtra apenas os arquivos com extensão '.pdf'
        const pdfFiles = files.filter((file) => path.extname(file).toLowerCase() === '.pdf');

        if (pdfFiles.length === 0) {
            console.log('Nenhum arquivo PDF encontrado na pasta.');
            return;
        }

        // Processa cada arquivo PDF encontrado
        pdfFiles.forEach((pdfFile) => {
            // Obtém o caminho completo do arquivo PDF
            const pdfPath = path.join(directory, pdfFile);

            // Lê o PDF e insere seus dados no banco de dados
            readPDF(pdfPath)
                .then((pdfData) => {
                    insertDataIntoPostgres(pdfFile, pdfData);
                })
                .catch((error) => {
                    console.error('Erro ao ler o PDF:', pdfPath, error);
                });
        });
    });
}

// Inicia o processo de leitura e inserção dos dados dos PDFs na pasta 'pdfsDirectory'
readAllPDFsFromDirectory(pdfsDirectory);
