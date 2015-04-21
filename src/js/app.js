var Grid = require('./components/grid'),
    React = require('react'),
    $ = require('jquery'),
    App = React.createClass({
        getInitialState: function(){
            return {
                header: [],
                rows: []
            };
        },
        componentDidMount: function(){
            $.ajax({
                url: '/data'
            }).success(function(data){
                this.setState({
                    header: data.header,
                    rows: data.rows
                });
            }.bind(this));
        },
        render: function(){
            return (<Grid rows={this.state.rows} header={this.state.header} />);
        }
    });



React.render(<App />, document.getElementById('main'));

