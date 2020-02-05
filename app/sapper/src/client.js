import * as sapper from '@sapper/app';
import './style.scss'
import '../node_modules/bulma/css/bulma.min.css'

sapper.start({
	target: document.querySelector('#sapper')
});