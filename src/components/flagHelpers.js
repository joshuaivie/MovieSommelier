import '../images/cn.svg';
import '../images/es.svg';
import '../images/fr.svg';
import '../images/gb.svg';
import '../images/jp.svg';

const getFlagURL = (language) => {
  let ISOCode;
  switch (language.toLocaleLowerCase()) {
    case 'french':
      ISOCode = 'fr'
      break;
    case 'spanish':
      ISOCode = 'es'
      break;
    default:
      ISOCode = 'gb'
      break;
  }

  return `../images/${ISOCode}.svg`
}

export default getFlagURL