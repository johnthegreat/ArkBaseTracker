const dictionary = {
	"Aberration": "Aberration_P.jpg",
	"Crystal Isles": "CrystalIsles.jpg",
	"Extinction": "Extinction.jpg",
	"Genesis": "Genesis.jpg",
	"Ragnarok": "Ragnarok.png",
	"Scorched Earth": "ScorchedEarth_P.png",
	"The Center": "TheCenter.jpg",
	"The Island": "TheIsland.jpg",
	"Valgeuro": "Valguero_P.jpg"
};

const getServerMapFromName = function(mapName) {
	return dictionary[mapName];
};

module.exports = getServerMapFromName;
