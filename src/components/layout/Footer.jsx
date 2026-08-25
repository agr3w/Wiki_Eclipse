import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <div className={styles.brandName}>ECLIPSE : ECOS DO ABISMO</div>
          <p className={styles.brandDescription}>
            Projeto acadêmico multidisciplinar de desenvolvimento de jogos 2D e governança de software.
            Construído em Godot Engine 4.7 e React.
          </p>
        </div>

        <div>
          <div className={styles.columnTitle}>Navegação</div>
          <ul className={styles.linkList}>
            <li><Link to="/" className={styles.link}>Início</Link></li>
            <li><Link to="/wiki" className={styles.link}>Wiki Oficial</Link></li>
            <li><Link to="/loja" className={styles.link}>Loja & Download</Link></li>
            <li><Link to="/biblioteca" className={styles.link}>Minha Biblioteca</Link></li>
          </ul>
        </div>

        <div>
          <div className={styles.columnTitle}>Repositórios</div>
          <ul className={styles.linkList}>
            <li>
              <a href="https://github.com/agr3w/Godot_prototity" target="_blank" rel="noreferrer" className={styles.link}>
                GitHub (Game Engine)
              </a>
            </li>
            <li>
              <a href="https://github.com/agr3w/wiki_eclipse" target="_blank" rel="noreferrer" className={styles.link}>
                GitHub (Portal Web)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>© 2026 • Licença Acadêmica Aberta</span>
        <span>Jira & Confluence Gov • Godot 4.7.1</span>
      </div>
    </footer>
  );
};

export default Footer;
