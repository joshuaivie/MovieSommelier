import './index.css';
import './images/Logo.png';
import Home from './home';
import DetailsModal from './components/modal';

const home = new Home(document.getElementById('main'));
const modal = new DetailsModal();
home.init();
modal.init();