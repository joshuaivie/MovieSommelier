import './index.css';
import './images/Logo.png';
import Home from './home';
import CommentViewer from './components/comments';

const home = new Home(document.getElementById('main'));
const commentViewer = new CommentViewer();
home.init();
commentViewer.init();
