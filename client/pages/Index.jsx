import React, {Component} from 'react';
import Kittens from '../components/Kittens';

export default class Index extends Component {
  componentDidMount() {
    this.props.requestKittens();
  }

  render() {
    const {sheet} = this.props;

    return (
        <div className={sheet.classes.index}>
          <Kittens/>
        </div>
    );
  }
}

const STYLES = {
  index: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFDDDD',
    color: '#660000'
  }
};
//
// export default connect(
//     () => ({}),
//     {requestKittens}
// )(
//     useSheet(Index, STYLES)
// );
