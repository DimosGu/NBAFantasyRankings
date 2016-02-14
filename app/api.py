import MySQLdb
import json
from MySQLdb.cursors import DictCursor
from flask_restful import Resource, reqparse
from operator import itemgetter


class GetRankings(Resource):
    def __init__(self):
        self.db = MySQLdb.connect(host='162.243.38.78', user='fred', db='startwinning', cursorclass=DictCursor)
        self.cur = self.db.cursor()

    def get(self):
        try:
            parser = reqparse.RequestParser()
            parser.add_argument('stats', type=str, help='stats selection param')
            parser.add_argument('period', type=str, help='period selection param')
            args = parser.parse_args()
            query_stats = args['stats'].split('%')
            rankings = self._get_stats(query_stats, args['period'])
            rankings = self._rankings_adjust(rankings, query_stats)
            return rankings
        except Exception as e:
            return {'error':str(e)}

    def _rankings_adjust(self, rankings, query_stats):
        for player in rankings:
            sum = 0
            for stat in query_stats:
                sum += player[stat]
            player['tot'] = sum
            player['name'] = player['first_name'] + " " + player['last_name']
            del player['first_name']
            del player['last_name']
        rankings = sorted(rankings, key=itemgetter('tot'), reverse=True) 
        count = 1
        for player in rankings:
            player['rank'] = count
            count += 1
        return rankings


    def _get_stats(self, stats, period):
        stats_len = len(stats)
        query_string = "SELECT ft_pct, first_name, last_name, min, stl, pts, fg_pct, tov, fg3m, reb, fgm, ast, fg3_pct, aot, blk, player_id, games_played, ftm FROM "
        query_string = query_string + self._period_to_table_mapping(period)
        self.cur.execute(query_string)
        return self.cur.fetchall()

    def _period_to_table_mapping(self, period):
        if period == 'ALL':
            return "RANKING_ALL_2015"
        elif period == "3M":
            return "RANKING_3M_2015"
        elif period == "2M":
            return "RANKING_2M_2015"
        elif period == "1M":
            return "RANKING_1M_2015"
        elif period == "3W":
            return "RANKING_3W_2015"
        elif period == "2W":
            return "RANKING_2W_2015"
        elif period == "1W":
            return "RANKING_1W_2015"
        else:
            return "RANKING_ALL_2015"

