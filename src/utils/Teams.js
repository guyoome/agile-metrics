import TEAMS from "../constants/teams";

/** @type Object */
const Teams = {

    /** @type [Object] */
    list: TEAMS,

    /**
     * get Tags of all teams
     *
     * @returns {Object} tags
     */
    getTags: function () {
        const tags = [];
        this.list.forEach(team => {
            tags.push(team.tag)
        });
        return tags;
    },

    /**
     * get Team info from its tag
     * 
     * @param {String} tag a string in that format ABC
     * @returns {Object} team
     */
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