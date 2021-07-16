import {render} from 'preact';
import Router from 'preact-router'
import { App } from './app'
import { Mangapro } from './mangaprovide'
import './css/tailwind.css'
import { Search } from './search'

const Main = () => (
	<Router>
		<App path="/:page?/:perpage?" />
<App path="/app/:page?/:perpage?" />
<Mangapro path="/manga/:mangaida" />
<Search path="/search/:query/:page?/:perpage?" />
	</Router>
);

render(<Main />, document.getElementById('app'))
