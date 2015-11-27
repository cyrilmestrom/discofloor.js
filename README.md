# discofloor.js
A canvas-based discofloor - just for fun

Build on javascript, HTML5 Canvas and setTimeout used to create patterns. Feel free to use, edit or play with. 
Or add new patterns.

Use Discofloor-object to intialize discofloor:

<i><b>var disco = new DiscoFloor('disco', [config]);</b></i>

Use config-object to set following options (default)

  <i>speed (100)<br/>
  sizeX (7)<br/>
  sizeY (4)<br/>
  colors (['#BCC22C', '#FD4E70', '#856A5E', '#6AB5AA', '#D5D97C'])<br/>
  borderColor ('#000000')<br/>
  borderWidth (3)<br/>
  floorColor ('#333333')<br/></i>

Use startProgram(program, infinite) to start a program(array of pattern-names) for example:

  <i><b>disco.startProgram(['diagonalLT','diagonalRB', 'diagonalLB', 'diagonalRT', 'all', 'all', 'all', 'all']);</b></i>
  
Choose from the following patterns:

  <i>row-by-block<br/>
  column-by-block<br/>
  lines-top<br/>
  lines-bottom<br/>
  diagonalLT<br/>
  diagonalLB<br/>
  diagonalRT<br/>
  diagonalRB<br/>
  all<br/>
  snake<br/></i>
