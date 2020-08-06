import React from "react";

import whatsappIcon from '../../assets/images/icons/whatsapp.svg';

import "./styles.css";

const TeacherItem = () => {
  return (
    <article className="teacher-item">
      <header>
        <img
          src="https://pbs.twimg.com/profile_images/1078278632290832386/nOeGNCpC_400x400.jpg"
          alt="Goku"
        />
        <div>
          <strong>Goku</strong>
          <span>Kamehameha</span>
        </div>
      </header>

      <p>
        Goku é o personagem que mais possui conhecimento sobre técnicas de
        batalha.
        <br />
        <br />
        Os Saiyajins são uma raça guerreira, e uma de suas habilidades especiais
        é a de se tornarem mais fortes após serem feridos gravemente, e se
        chegarem ao ponto de quase morrer devido a lesões físicas graves e se
        recuperarem, seu poder de luta aumentará incrivelmente o que é chamado
        de zenkai.
      </p>

      <footer>
        <p>
          Preço/hora
          <strong>R$ 90,00</strong>
        </p>
        <button type="button">
          <img src={whatsappIcon} alt="Entrar em contato" />
          Entrar em contato
        </button>
      </footer>
    </article>
  );
};

export default TeacherItem;
