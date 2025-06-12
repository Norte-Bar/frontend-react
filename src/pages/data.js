// src/data.js

// --- Importe suas imagens aqui, de dentro da pasta 'imgs' ---

// Certifique-se de que o caminho e o nome do arquivo estão corretos.
import bruschettaImg from '../imgs/bruschetta.jpeg';
import saladaCaprese from '../imgs/salada-caprese.jpeg';
import Risoto from '../imgs/Risoto.jpeg';
import Salmao from '../imgs/salmao.jpeg';
import Sorvete from '../imgs/sorvete.jpeg';
import Bife from '../imgs/bife.webp';
import Agua from '../imgs/agua.png';
import Cocacola from '../imgs/coca-cola.webp';
import Maracuja from '../imgs/maracuja.jpeg';
import Pudim from '../imgs/pudim.jpeg';
import Laranja from '../imgs/laranja.jpeg';
import Camarao from '../imgs/camarao.jpg';
// ---------------------------------

const menuData = {
  entradas: [
    {
      id: 'e1',
      nome: 'Bruschetta de Tomate e Manjericão',
      descricao: 'Pão italiano tostado com tomates frescos, manjericão e azeite extra virgem.',
      preco: 25.00,
      imagem: bruschettaImg, // Use a referência importada aqui
    },
    {
      id: 'e2',
      nome: 'Camarão Empanado',
      descricao: 'Camarão empanado crocante com molho tártaro suave e leve com pequeno toque de limão.',
      preco: 18.00,
      imagem: Camarao,
    },
    {
      id: 'e3',
      nome: 'Salada Caprese',
      descricao: 'Tomate cereja, mussarela de búfala, manjericão e redução de balsâmico.',
      preco: 32.00,
      imagem: saladaCaprese,
      imageHeight: '160px', // Experimente um valor menor
   objectFit: 'cover'
    },
  ],
  pratosPrincipais: [
    {
      id: 'pp1',
      nome: 'Risoto de Funghi Porcini',
      descricao: 'Arroz arbóreo cremoso com cogumelos funghi porcini secos.',
      preco: 65.00,
      imagem: Risoto,
    },
    {
      id: 'pp2',
      nome: 'Salmão Grelhado com Aspargos',
      descricao: 'Filé de salmão grelhado servido com aspargos frescos e molho de maracujá.',
      preco: 85.00,
      imagem: Salmao,
    },
    {
      id: 'pp3',
      nome: 'Bife Ancho com Batatas Rústicas',
      descricao: 'Corte nobre de carne bovina servido com batatas rústicas e chimichurri.',
      preco: 95.00,
      imagem: Bife,
      imageHeight: '180px',
      objectFit: 'cover'
    },
  ],
  bebidas: [
    {
      id: 'b1',
      nome: 'Água Mineral',
      descricao: 'Com ou sem gás.',
      preco: 6.00,
      imagem: Agua,
      imageHeight: '350px',
      objectFit: 'contain'
    },
    {
      id: 'b2',
      nome: 'Refrigerante',
      descricao: 'Coca-Cola',
      preco: 8.00,
      imagem: Cocacola,
      imageHeight: '300px',
      objectFit: 'contain'
    },
    {
      id: 'b3',
      nome: 'Suco Natural',
      descricao: 'Laranja',
      preco: 12.00,
      imagem: Laranja,
      imageHeight: '280px',
      objectFit: 'contain'
    },

  ],
  sobremesas: [
    {
      id: 's1',
      nome: 'Petit Gateau com Sorvete',
      descricao: 'Bolo de chocolate com recheio cremoso e sorvete de creme.',
      preco: 28.00,
      imagem: Sorvete,
    },
    {
      id: 's2',
      nome: 'Mousse de Maracujá',
      descricao: 'Mousse de maracujá leve e aerado com calda da fruta e hortelã.',
      preco: 22.00,
      imagem: Maracuja,
    },
    {
      id: 's3',
      nome: 'Pudim de Leite Condensado',
      descricao: 'Clássico pudim de leite condensado com calda de caramelo.',
      preco: 18.00,
      imagem: Pudim,
    },
  ],
};

export default menuData;