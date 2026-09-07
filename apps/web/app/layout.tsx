import "./style.css";
export const metadata = { title: "Minecraft Browser Client — Runtime Lab", description: "A lawful, local-browser runtime investigation." };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
