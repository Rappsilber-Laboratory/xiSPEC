var Peptide = Backbone.Model.extend({

	initialize: function(){
		this.on("change:JSONdata", function(){
			this.setData();
			this.trigger("changed:JSONdata");
		});
	},

	setData: function(){
		this.JSONdata = this.get("JSONdata");
		this.pepStrs = [];
		this.peptides = this.JSONdata.Peptides;
		this.pepStrs = [];
		for(i=0; i < this.peptides.length; i++){
			this.pepStrs[i] = "";
			for(j = 0; j < this.peptides[i].sequence.length; j++)
				this.pepStrs[i] += this.peptides[i].sequence[j].aminoAcid;
		}
		this.cmap = colorbrewer.RdBu[8];
		this.p1color = this.cmap[0];
		this.p2color = this.cmap[7];
		this.highlightColour = "yellow";
		this.highlightWidth = 10;
		console.log(this.pepStrs);
	}
});