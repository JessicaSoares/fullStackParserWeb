// Importações dos ícones da barra lateral
import {
  UilEstate, // Ícone para o painel de controle (dashboard)
  UilClipboardAlt, // Ícone para o histórico de faturas (history-invoice)
} from "@iconscout/react-unicons";

// Dados da barra lateral
export const SidebarData = [
  {
    icon: UilEstate, // Ícone para o painel de controle (dashboard)
    heading: "Dashboard", // Texto para exibir como título do link
    to: "/dashboard", // Caminho para a rota do painel de controle
  },
  {
    icon: UilClipboardAlt, // Ícone para o histórico de faturas (history-invoice)
    heading: "Histórico", // Texto para exibir como título do link
    to: "/history-invoice", // Caminho para a rota do histórico de faturas
  },
];
