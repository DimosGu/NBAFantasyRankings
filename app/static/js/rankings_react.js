//RANKING PAGE

//PARENT CONTAINER
var RankingPage = React.createClass({displayName: 'rankingPage',
    refreshPressed: function(e){
        e.preventDefault();
        var filterString = this.refs.filters.getFilters();
        //display overlay
        this.refs.results.loadRankingsFromServer("http://127.0.0.1:5000/getrankings?" + filterString);
        //remove overlay
    },
    componentDidMount: function(){
        //display overlay
        this.refs.results.loadRankingsFromServer("http://127.0.0.1:5000/getrankings?stats=fgm%fg_pct%fg3m%fg3_pct%ftm%ft_pct%pts%ast%tov%aot%stl%blk&period=ALL");
        //remove overlay
    },
    render: function(){
        return(
            <div className="rankingPage">
                <Title />
                <FilterMenu ref="filters" refreshPressed={this.refreshPressed}/>
                <Results ref="results"/>
            </div>
        );
    }
});

//NAVBAR (Stopped using this after app was transfered to Flask)
var NavBarMain = React.createClass({displayName: 'navBarMain',
    winningColor: {
        color: '#ff8812'
    },
    render: function(){
        return(
            <div className="navBarMain">
                <div className="container">
                    <nav className="navbar navbar-default">
                        <ul className="nav navbar-nav navbar-left">
                            <li className="logo"><a href="#">#START<span style={this.winningColor}>WINNING</span></a></li>
                            <li><a href="#">Rankings</a></li>
                            <li><a href="#">Trade Analysis</a></li>
                            <li><a href="#">My League</a></li>
                            <li><a href="#">Statistical Learning</a></li>
                            <li><a href="#">About</a></li>
                        </ul>
                    </nav>
                    <hr/>
                </div>
            </div>
        );
    }
});

//TITLE
var Title = React.createClass({displayName: 'title',
    winningColor: {
        color: '#ff8812'
    },
    render: function(){
        return(
            <div className="title container">
                <hr/>
                <h1 className="text-center">RANKINGS</h1>
                <hr/>
            </div>
        );
    }
});

//PARENT FILTER MENU
var FilterMenu = React.createClass({displayName: 'filterMenu',
    getFilters: function(){
        var statState = this.refs.statFilters.state.stats;
        var periodState = this.refs.periodFilters.state.periods;
        var filterParams = "stats=";
        for(var i = 0; i < statState.length; i++) {
            if (statState[i].isChecked) {
                // the last value appended does not need a '%'
                if(i+1 != statState.length) filterParams = filterParams + statState[i].valueName + '%';
                else filterParams = filterParams + statState[i].valueName;
            }
        }
        for(var j = 0; j < periodState.length; j++){
            if(periodState[j].isChecked){
                filterParams = filterParams + "&period=" + String(periodState[j].displayName);
                break;
            }
        }
        return filterParams;
    },

    render: function(){
        return(
            <div className="filterMenu container">
                <form id="filterMenu">
                    <h5 className="textLeft">SELECT STATS:</h5>
                    <FilterStats ref="statFilters" initialStatFilters={statFilters}/>
                    <div id="periodContainer">
                        <h5 className="textLeft">SELECT PERIOD:</h5>
                        <FilterPeriod ref="periodFilters" initialPeriodFilters={periodFilters}/>
                    </div>
                    <div id="refreshContainer">
                        <h5 className="textLeft">REFRESH:</h5>
                        <RefreshButton refreshPressed={this.props.refreshPressed}/>
                    </div>
                </form>
                <hr/>
            </div>
        );
    }
});

var periodFilters = [
    {id: 1, type:"radio", formName: "filterPeriod", displayName: "ALL", valueName: "all", isChecked: true},
    {id: 2, type:"radio", formName: "filterPeriod", displayName: "3M", valueName: "m3", isChecked: false},
    {id: 3, type:"radio", formName: "filterPeriod", displayName: "2M", valueName: "m2", isChecked: false},
    {id: 4, type:"radio", formName: "filterPeriod", displayName: "1M", valueName: "m1", isChecked: false},
    {id: 5, type:"radio", formName: "filterPeriod", displayName: "3W", valueName: "w3", isChecked: false},
    {id: 6, type:"radio", formName: "filterPeriod", displayName: "2W", valueName: "w2", isChecked: false},
    {id: 7, type:"radio", formName: "filterPeriod", displayName: "1W", valueName: "w1", isChecked: false}
];
var statFilters = [
    {id: 1, type:"checkbox", formName: "filterStat", displayName: "FGM", valueName: "fgm", isChecked: true},
    {id: 2, type:"checkbox", formName: "filterStat", displayName: "FG%", valueName: "fg_pct", isChecked: true},
    {id: 3, type:"checkbox", formName: "filterStat", displayName: "3PM", valueName: "fg3m", isChecked: true},
    {id: 4, type:"checkbox", formName: "filterStat", displayName: "3P%", valueName: "fg3_pct", isChecked: true},
    {id: 5, type:"checkbox", formName: "filterStat", displayName: "FTM", valueName: "ftm", isChecked: true},
    {id: 6, type:"checkbox", formName: "filterStat", displayName: "FT%", valueName: "ft_pct", isChecked: true},
    {id: 7, type:"checkbox", formName: "filterStat", displayName: "PTS", valueName: "pts", isChecked: true},
    {id: 8, type:"checkbox", formName: "filterStat", displayName: "REB", valueName: "reb", isChecked: true},
    {id: 9, type:"checkbox", formName: "filterStat", displayName: "AST", valueName: "ast", isChecked: true},
    {id: 10, type:"checkbox", formName: "filterStat", displayName: "TOV", valueName: "tov", isChecked: true},
    {id: 11, type:"checkbox", formName: "filterStat", displayName: "A/T", valueName: "aot", isChecked: true},
    {id: 12, type:"checkbox", formName: "filterStat", displayName: "STL", valueName: "stl", isChecked: true},
    {id: 13, type:"checkbox", formName: "filterStat", displayName: "BLK", valueName: "blk", isChecked: true}
];

var Results = React.createClass({displayName: 'results',
    getInitialState: function(){
        return {players: []};
    },

    loadRankingsFromServer: function(url){
        $.ajax({
            url: url,
            dataType: 'json',
            cache: false,
            success: function(players){
                this.setState({players: players});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    createHeaderRow: function(){
        return(
            <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>GP</th>
                <th>Min</th>
                <th>FGM</th>
                <th>FG%</th>
                <th>3PM</th>
                <th>3P%</th>
                <th>FTM</th>
                <th>FT%</th>
                <th>REB</th>
                <th>AST</th>
                <th>TO</th>
                <th>A/T</th>
                <th>STL</th>
                <th>BLK</th>
                <th>PPG</th>
                <th id="tot">TOT</th>
            </tr>
        );
    },

    createRow: function(player){
        return(
            <TableRow
                rank={player.rank}
                name={player.name}
                gp={player.games_played.toFixed(2)}
                min={player.min.toFixed(2)}
                fgm={player.fgm.toFixed(2)}
                fg_pct={player.fg_pct.toFixed(2)}
                fg3m={player.fg3m.toFixed(2)}
                fg3_pct={player.fg3_pct.toFixed(2)}
                ftm={player.ftm.toFixed(2)}
                ft_pct={player.ft_pct.toFixed(2)}
                reb={player.reb.toFixed(2)}
                ast={player.ast.toFixed(2)}
                tov={player.tov.toFixed(2)}
                aot={player.aot.toFixed(2)}
                stl={player.stl.toFixed(2)}
                blk={player.blk.toFixed(2)}
                pts={player.pts.toFixed(2)}
                tot={player.tot.toFixed(2)}
            />
        );
    },

    render: function(){
        return(
            <div className="resultTable container">
                <h3 className="textLeft">RESULTS:</h3>
                <div className="tableResponsive" id="rankings">
                    <table id="ranking_table" className="table">
                        <thead>
                            {this.createHeaderRow()}
                        </thead>
                        <tbody className="list">
                            {this.state.players.map(this.createRow)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

var TableRow = React.createClass({displayName: 'tableRow',
    render: function(){
        return(
            <tr>
                <td className="rank">{this.props.rank}</td>
                <td className="name">{this.props.name}</td>
                <td className="gp">{this.props.gp}</td>
                <td className="min">{this.props.min}</td>
                <td className="fgm">{this.props.fgm}</td>
                <td className="fg_pct">{this.props.fg_pct}</td>
                <td className="fg3m">{this.props.fg3m}</td>
                <td className="fg3_pct">{this.props.fg3_pct}</td>
                <td className="ftm">{this.props.ftm}</td>
                <td className="ft_pct">{this.props.ft_pct}</td>
                <td className="reb">{this.props.reb}</td>
                <td className="ast">{this.props.ast}</td>
                <td className="tov">{this.props.tov}</td>
                <td className="aot">{this.props.aot}</td>
                <td className="stl">{this.props.stl}</td>
                <td className="blk">{this.props.blk}</td>
                <td className="pts">{this.props.pts}</td>
                <td className="tot">{this.props.tot}</td>
            </tr>
        );
    }
});

var RefreshButton = React.createClass({displayName: 'refreshButton',
    render: function(){
        return(
            <div className="refreshButton">
                <input type="submit" id="refreshID" value="refreshVal" onClick={this.props.refreshPressed} hidden />
                <label htmlFor="refreshID" form="filterMenu">
                    <svg height="65" width="65">
                        <g>
                            <circle cx="30" cy="30" r="25" fill="#2EFE2E" stroke="black" strokeWidth="2px" ref={(ref) => this.circleColorRef = ref} />
                            <text x="46%" y="53%" textAnchor="middle" fontFamily="Verdana" fontSize="15" fill="black" ref={(ref) => this.textColorRef = ref}>GO</text>
                        </g>
                    </svg>
                </label>
            </div>
        );
    }
});

var CircleComponent = React.createClass({displayName:'circleComponent',
    render: function(){
        return (
            <div className="circleComponent">
                <input type={this.props.type}
                       name={this.props.formName}
                       id={this.props.valueName}
                       onChange={this.props.onChange}
                       checked={this.props.isChecked}
                       hidden/>
                <label htmlFor={this.props.valueName}>
                    <svg height="65" width="65">
                        <g>
                            <circle cx="30" cy="30" r="25"
                                    fill={this.props.isChecked ? 'orange': '#dededa'}
                                    stroke="black" strokeWidth="2px"/>
                            <text x="46%" y="53%" textAnchor="middle" fontFamily="Verdana" fontSize="15" fill="black">{this.props.displayName}</text>
                        </g>
                    </svg>
                </label>
            </div>
        );
    }
});

var FilterStats = React.createClass({displayName: 'filterStats',
    getInitialState: function(){
        return {stats: this.props.initialStatFilters}
    },

    filterStatChange: function(){
        var updateCheck = document.getElementsByName('filterStat');
        for (var i = 0; i < this.state.stats.length; i++) {
            this.state.stats[i].isChecked = updateCheck[i].checked;
        }
        this.setState({ stats: this.state.stats });
    },

    buildStatFilters: function(stat){
        return(
             <CircleComponent key={stat.id} formName={stat.formName} type={stat.type} valueName={stat.valueName} displayName={stat.displayName} isChecked={stat.isChecked} onChange={this.filterStatChange}/>
        );
    },

    render: function(){
        return(
            <div className="filterStats">
                {this.state.stats.map(this.buildStatFilters)}
            </div>
        );
    }
});

var FilterPeriod = React.createClass({displayName: 'filterPeriod',
    getInitialState: function(){
        return {periods: this.props.initialPeriodFilters}
    },

    filterPeriodChange: function(){
        var updateCheck = document.getElementsByName('filterPeriod');
        for (var i = 0; i < this.state.periods.length; i++) {
            this.state.periods[i].isChecked = updateCheck[i].checked;
        }
        this.setState({ periods: this.state.periods });
    },

    buildPeriodFilters: function(period){
        return(
             <CircleComponent key={period.id} formName={period.formName} type={period.type} valueName={period.valueName} displayName={period.displayName} isChecked={period.isChecked} onChange={this.filterPeriodChange}/>
        );
    },

    render: function(){
        return(
            <div className="filterPeriodContainer">
                {this.state.periods.map(this.buildPeriodFilters)}
            </div>
        );
    }
});

ReactDOM.render(
    <RankingPage />,
    document.getElementById('content')
);