const Footer = () => {
    return (
      <footer className="bg-zinc-900 text-white py-6 mt-auto w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full sm:w-auto text-center sm:text-left mb-4 sm:mb-0">
              <h2 className="text-2xl font-bold">PhotoVault</h2>
              <p className="text-gray-400">© 2024 Todos os direitos reservados.</p>
            </div>
            <div className="w-full sm:w-auto text-center">
              <ul className="flex flex-col sm:flex-row sm:space-x-4">
                <li><a href="#" className="hover:text-blue-400">Sobre</a></li>
                <li><a href="#" className="hover:text-blue-400">Serviços</a></li>
                <li><a href="#" className="hover:text-blue-400">Contato</a></li>
              </ul>
            </div>
            <div className="w-full sm:w-auto text-center sm:text-right mt-4 sm:mt-0">
              <p className="text-gray-400">Email: contato@meusite.com</p>
              <p className="text-gray-400">Telefone: (123) 456-7890</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  
  export default Footer;
  