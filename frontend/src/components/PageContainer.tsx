export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={styles.page}>
      <div style={styles.container}>{children}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "calc(100vh - 64px)", // header hariç
    background: "#222",
    color: "white",
    padding: "32px 0",
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px",
    alignItems: "center",
    justifyContent: "center",
  },
};
