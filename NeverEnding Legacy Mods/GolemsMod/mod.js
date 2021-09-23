function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

G.AddData({
    name:'Golems',
    author:'Luckius_',
    desc:'A mod that adds the golem, new workers.',
    engineVersion:1,
    manifest: 0,
    requires:['Default dataset*'],
    sheets:{
        
    },

    func:function() {

        G.resCategories['golems'] = {
            name: 'Golems',
            base: [],
            side: []
        };

        M = {}; //Short term for mod

        M.golems = []

        M.GolemData=function(data) {
            this.type='';
            this.maxLife=0;
            this.lifetime=0;

            for (var i in data) this[i]=data[i];
            M.golems.push(this);
        }

        let currentTick = 0;

        M.update=function() {
            var mudGolemAmount = G.getRes('mud golem').amount;
            //var clayGolemAmount = G.getRes('clay golem').amount;
            var golemDataLength = M.golems.length;

            if (golemDataLength < mudGolemAmount)
            {
                for (let i = 0; i < mudGolemAmount; i++) {
                    new M.GolemData({
                        type:'mud',
                        maxLife:getRandomInt(365, 385),
                    });
                };

                /*for (let i = 0; i < clayGolemAmount; i++) {
                    new M.GolemData({
                        type:'clay',
                        maxLife:20,
                    });
                }*/
            }
            
            //if (currentTick%250==0) console.log('mod update');

            currentTick++;
        }

        setInterval(M.update, 1); //Loop update every 1 ms

        new G.Res({
            name:'mud golem',
            desc:'[mud golem, Golems] made from mud.//[mud golem, Golems] make are an addition to your [worker,workforce].//[mud golem, Golems] dies after a certain amount of time.',
            //startWith:5,
            visible:true,
            partOf:'worker',
            category:'golems',
            icon:[0,0],
            tick:function(me,tick)
		    {  
                if (me.amount>0)
			    {
                    if (tick%1==0) 
                    {
                        var toRemove = [];

                        for (let golemId = 0; golemId < M.golems.length; golemId++) {
                            const golem = M.golems[golemId];

                            if (golem != undefined)
                            {
                                if (golem.type == 'mud')
                                {
                                    golem.lifetime+=Math.random * 2;

                                    if (golem.lifetime >= golem.maxLife) 
                                    {
                                        G.lose(me.name, 1, 'golem death');
                                        toRemove.push(golemId);
                                    }
                                }
                            }
                        }

                        for (let i = 0; i < toRemove.length; i++) {
                            const id = toRemove[i];
                            delete M.golems[id];
                        }
                    }
                }
            }
        });

    }

});