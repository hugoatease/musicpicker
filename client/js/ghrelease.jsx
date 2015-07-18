var GHRelease = React.createClass({
  getInitialState: function() {
    return {
      windows: null
    }
  },

  componentDidMount: function() {
    jQuery.get(
      'https://api.github.com/repos/musicpicker/MusicPickerDevice/releases/latest'
    ).then(function(data) {
      var url = data.assets.filter(function(item) {
        if (item.name === 'setup.exe') {
          return true;
        }
      })[0].browser_download_url;
      this.setState({windows: url});
    }.bind(this));
  },

  render: function() {
    var buttons = (
      <span>Fetching latest releases...</span>
    );

    if (this.state.windows !== null) {
      buttons = <a href={this.state.windows} className="btn btn-primary">Windows</a>
    }

    return (
      <div className="panel panel-primary">
        <div className="panel-body">
          <div className="row">
            <div className="col-md-2">
              <span style={{fontSize: '3em'}} className="glyphicon glyphicon-download-alt"></span>
            </div>
            <div className="col-md-10">
              <p><b>Get Musicpicker player</b><br />
              <small>OS X and Linux support coming soon</small></p>
              {buttons}
            </div>
          </div>
        </div>
      </div>
    );
  }
})
