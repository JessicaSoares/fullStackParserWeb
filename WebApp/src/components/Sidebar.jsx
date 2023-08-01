import React, { useState } from "react";
import "./Sidebar.css";
import Logo from "../imgs/logo.png";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { SidebarData } from "../Data/Data";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [selected, setSelected] = useState(0); // Estado para armazenar o item selecionado da barra lateral

  const [expanded, setExpaned] = useState(true); // Estado para controlar a expansão/retração da barra lateral

  // Variáveis para definir as animações da barra lateral
  const sidebarVariants = {
    true: {
      left: '0', // Posição à esquerda quando a barra lateral está expandida
    },
    false: {
      left: '-60%', // Posição à esquerda quando a barra lateral está retraída
    }
  };

  console.log(window.innerWidth); // Exibição no console da largura da janela do navegador

  return (
    <>
      {/* Botão para expandir/retrair a barra lateral */}
      <div className="bars" style={expanded ? { left: '60%' } : { left: '5%' }} onClick={() => setExpaned(!expanded)}>
        <UilBars />
      </div>
      {/* Componente da barra lateral */}
      <motion.div
        className='sidebar'
        variants={sidebarVariants}
        animate={window.innerWidth <= 768 ? `${expanded}` : ''} // Animação com base na largura da janela
      >
        {/* Logo */}
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>

        <div className="menu">
          {/* Mapeamento dos itens da barra lateral */}
          {SidebarData.map((item, index) => {
            return (
              <div
                className={selected === index ? "menuItem active" : "menuItem"} // Estilo ativo para o item selecionado
                key={index}
                onClick={() => setSelected(index)} // Ao clicar em um item, define-o como selecionado
              >
                {/* Link para a rota do item */}
                <Link to={item.to} style={{ textDecoration: 'none', color: 'black', fontSize: '15px' }}>
                  <item.icon style={{ marginRight: '8px' }} /> {/* Ícone do item */}
                  <span>{item.heading}</span> {/* Texto do item */}
                </Link>
              </div>
            );
          })}
          {/* Ícone de sair (sign out) */}
          <div className="menuItem">
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
