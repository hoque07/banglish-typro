export default function Footer() {
  return (
    <footer
      id="site-footer"
      style={{
        width: "100%",
        position: "relative",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "48px 24px",
        marginTop: "60px",
        color: "#527091",
      }}
    >
      <p style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 600 }}>
        Developed by{" "}
        <a
          href="https://tanvirnibir.com"
          target="_blank"
          rel="noreferrer"
          style={{
            color: "#2563eb",
            fontWeight: 900,
            textDecoration: "none",
          }}
        >
          TANVIR NIBIR
        </a>
      </p>

      <p style={{ margin: 0, fontSize: "14px" }}>
        BANGLISH TYPRO V1 · Full-stack SaaS Writing Assistant
      </p>
    </footer>
  );
}