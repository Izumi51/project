import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-center py-4 border-t border-gray-300 text-sm text-gray-600">
      © {new Date().getFullYear()} ProjectNI. Todos os direitos reservados.
    </footer>
  );
};

export default Footer;
