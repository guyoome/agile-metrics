import TEAMS from "../constants/TEAMS";

const Teams = {
    list: TEAMS,
    getTags: function () {
        const tags = [];
        this.list.forEach(team => {
            tags.push(team.tag)
        });
        return tags;
    },
    getTeamByTag: function (tag) {
        let teamByTag = "";
        this.list.forEach(team => {
            if (tag === team.tag) {
                teamByTag = team;
            }
        });
        return teamByTag;
    }

}

export default Teams;