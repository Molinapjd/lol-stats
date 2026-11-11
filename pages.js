// Páginas del índice. Cada página puede sumar varias cuentas de la misma persona:
//   { page: 'persona.html', name: 'Nombre', ids: ['cuenta1-euw', 'cuenta2-euw'] }
// La página agrupada usa <body data-summoner="cuenta1-euw,cuenta2-euw" data-person="Nombre">.
// Cuentas conocidas -> nick principal. En las tablas de compañeros se suman bajo ese nick.
window.LOL_ALIASES = {
  'Josiso #Mongo': 'Josiso', 'DonPimPon #Espin': 'Josiso',
  'Filosofofo #dncia': 'Joe', 'AllMuted49 #EUW': 'Nachete',
  'Rustu #rst': 'Rustu', 'elquenuncahacena #EUW': 'Rustu', 'Yan Diomandé #Yan D': 'Rustu'
};
window.LOL_PAGES = [
  { page: 'j3pi-euw.html', ids: ['j3pi-euw'] },
  { page: 'josiso.html', name: 'Josiso', ids: ['josiso-mongo', 'donpimpon-espin'] },
  { page: 'rustu.html', name: 'Rustu', ids: ['rustu-rst', 'elquenuncahacena-euw', 'yan-diomande-yan-d'] },
  { page: 'joe.html', name: 'Joe', ids: ['filosofofo-dncia'] },
  { page: 'nachete.html', name: 'Nachete', ids: ['allmuted49-euw'] }
];
