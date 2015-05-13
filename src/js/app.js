var Grid = require('./components/Grid.react'),
    React = require('react'),
    $ = require('jquery'),
    GridStore = require('./actions/GridActions')
    App = React.createClass({
        getInitialState: function(){
            return {
                header: [],
                rows: []
            };
        },
        componentDidMount: function(s){
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

