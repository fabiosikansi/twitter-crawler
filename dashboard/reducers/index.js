import { combineReducers } from 'redux'
import configuration from './configuration'
import stats from './stats'
import alerts from './alert'
import tweets from './tweets'

const App = combineReducers({
    configuration,stats,alerts,tweets
});

export default App;