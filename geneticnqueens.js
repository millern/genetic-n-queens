var expDist = function(population){
  var rand = Math.random() * 0.77;
  var lambda = 1.5;
  return Math.floor(population.length * Math.log(1-rand,Math.E) / (-lambda));
};

var GeneticNQueens = function(n){
  this.n = n;
  this.population = this.createPopulation();
};
GeneticNQueens.prototype.compare = function(a,b) {
  if (a.conflicts < b.conflicts)
     return -1;
  if (a.conflicts > b.conflicts)
    return 1;
  return 0;
  };
GeneticNQueens.prototype.createPopulation = function(){
  var array = [];
  _.each(_.range(10 * this.n), function(){
    array.push(new Board(this.n));
  },this);
  array.sort(this.compare);
  array.reverse();
  return array;
};

GeneticNQueens.prototype.prunePopulation = function(){
  var deadIndices = [];
  for (var i = 0; i < Math.floor(10 * this.n / 4); i++){
    deadIndices.push(expDist(this.population));
  }
  _(deadIndices).each(function(indexVal){
    this.population.splice(indexVal,1);
  }, this);
};

GeneticNQueens.prototype.mateBoards = function(board1, board2){
   var layout = [];
   layout = _(board1['layout']).map(function(gene, index){
    var rand = Math.random();
    return rand > 0.5 ? gene : board2['layout'][index];
   });
   return new Board(this.n,layout);
};

GeneticNQueens.prototype.matePopulation = function(){
  var mates = [];
  for (var i = 0; i < 10 * this.n; i++){
    mates[i] = [expDist(this.population), expDist(this.population)];
  }
  var newPopulation = _(mates).map(function(pair){
    return this.mateBoards(this.population[pair[0]], this.population[pair[1]]);
  }, this);
  newPopulation.sort(this.compare);
  newPopulation.reverse();
  return newPopulation;
};

GeneticNQueens.prototype.evolve = function(){
  var index = 0;
  while(this.population[0]['conflicts'] > 0 && index < 10000){
    this.prunePopulation();
    this.population = this.matePopulation();
    index++;
  }
  return this.population[0];
};

var Board = function(n, array){
  this.layout = array ? array : this.seedBoard(n);
  this.conflicts = 0;
  this.colHash = {};
  this.majorDiagHash = {};
  this.minorDiagHash = {};
  this.generateHashses();
  this.conflics = this.calculateConflicts();
};
Board.prototype.seedBoard = function(n){
  var result = [];
  for (var i = 0; i < n; i++){
    result.push(Math.floor(Math.random()*n));
  }
  return result;
};
Board.prototype.generateHashses = function(){
  _(this.layout).each(function(colIndex, rowIndex){
    var minorIndex = rowIndex + colIndex - 1;
    var majorIndex = rowIndex - colIndex - 1;
    //the following needs to be rewritten so that [0,0,0,0] is 6 conflicts instead 3.
    this.colHash[colIndex] = !this.colHash[colIndex] ? 1 : this.colHash[colIndex] + 1;
    this.minorDiagHash[minorIndex] = !this.minorDiagHash[minorIndex] ? 1 : this.minorDiagHash[minorIndex] + 1;
    this.majorDiagHash[majorIndex] = !this.majorDiagHash[majorIndex] ? 1 : this.majorDiagHash[majorIndex] + 1;
  }, this);
};
Board.prototype.calculateConflicts = function(){
  this.conflicts += _(this.colHash).reduce(function(memo, item){
    if (item > 1){
      return memo + item -1;
    } else{
      return memo;
    }
  },0);
    this.conflicts += _(this.majorDiagHash).reduce(function(memo, item){
    if (item > 1){
      return memo + item -1;
    } else{
      return memo;
    }
  },0);
   this.conflicts += _(this.minorDiagHash).reduce(function(memo, item){
    if (item > 1){
      return memo + item -1;
    } else{
      return memo;
    }
  },0);
};