import { Navbar } from "./Navbar";


interface LayoutProps{
    children:React.ReactNode;
    showNavbar?:boolean;
}
export const Layout:React.FC<LayoutProps> = ({showNavbar=true,children})=>{
    return(
        <div className="min-h-screen">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "pt-16" : ""}>
        {children}
      </main>
    </div>
    )
}