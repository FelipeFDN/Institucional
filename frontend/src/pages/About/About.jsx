import styles from './About.module.css'

export default function About() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Sobre Nós</h1>
        <div className={styles.content}>
          <p>
            Somos uma empresa comprometida com a qualidade e a inovação. Nossa missão é
            oferecer os melhores produtos e serviços para nossos clientes, sempre com
            foco na excelência e satisfação.
          </p>
          <p>
            Fundada em 2010, temos mais de uma década de experiência no mercado,
            construindo relacionamentos duradouros com nossos clientes e parceiros.
          </p>
          <p>
            Nossa equipe é formada por profissionais altamente qualificados, dedicados
            a superar as expectativas e entregar resultados excepcionais.
          </p>
        </div>
      </div>
    </div>
  )
}
