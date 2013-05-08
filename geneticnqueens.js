GeneticNQueens = function(n){

this.createBoard = function(){
  var board = {layout: [], conflicts: 0};
  colHash = {};
  majorDiagHash = {};
  minorDiagHash = {};
  for (var i = 0; i < n; i++){
    var colIndex = Math.floor(Math.random()*n);
    board['layout'].push(colIndex);
    colHash[colIndex] = !colHash[colIndex] ? 1 : colHash[colIndex] + 1;
    var minorIndex = board['layout'].length + colIndex - 1;
    var majorIndex = board['layout'].length - colIndex - 1;
    minorDiagHash[minorIndex] = !minorDiagHash[minorIndex] ? 1 : minorDiagHash[minorIndex] + 1;
    majorDiagHash[majorIndex] = !majorDiagHash[majorIndex] ? 1 : majorDiagHash[majorIndex] + 1;
  }
  board['conflicts'] += _(colHash).reduce(function(memo, item){
    if (item > 1){
      return memo + item -1;
    } else{
      return memo;
    }
  },0);
    board['conflicts'] += _(majorDiagHash).reduce(function(memo, item){
    if (item > 1){
      return memo + item -1;
    } else{
      return memo;
    }
  },0);
   board['conflicts'] += _(minorDiagHash).reduce(function(memo, item){
    if (item > 1){
      return memo + item -1;
    } else{
      return memo;
    }
  },0);
  return board;
};

this.createPopulation = function(){
  var array = [];
  _.each(_.range(10*n), function(){
    array.push(this.createBoard());
  },this);
  array.sort(this.compare);
  array.reverse();
  return array;
};
this.compare = function(a,b) {
  if (a.conflicts < b.conflicts)
     return -1;
  if (a.conflicts > b.conflicts)
    return 1;
  return 0;
};

this.prunePopulation = function(){
  var deadIndices = [];
  var lambda = 1.5;
  for (var i = 0; i < Math.floor(population.length/4); i++){
    var rand = Math.random()*.77;
    var expDist = Math.log(1-rand,Math.E) / (-lambda);
    deadIndices.push(Math.floor(expDist * population.length));
  }
  console.log(deadIndices);
};

this.matepopulation = function(){

};

var population = this.createPopulation();

var index = 0;

// while(population[0]['conflicts'] > 0 && index < 1000){
//   this.prunePopulation();
//   this.matePopulation();
// }

};
