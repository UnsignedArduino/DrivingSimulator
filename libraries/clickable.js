var cl_mouseWasPressed=!1;var cl_lastHovered=null;var cl_lastClicked=null;var cl_clickables=[];p5.prototype.runGUI=function(){for(i=0;i<cl_clickables.length;++i){if(cl_lastHovered!=cl_clickables[i])
cl_clickables[i].onOutside()}
if(cl_lastHovered!=null){if(cl_lastClicked!=cl_lastHovered){cl_lastHovered.onHover()}}
if(!cl_mouseWasPressed&&cl_lastClicked!=null){cl_lastClicked.onPress()}
if(cl_mouseWasPressed&&!mouseIsPressed&&cl_lastClicked!=null){if(cl_lastClicked==cl_lastHovered){cl_lastClicked.onRelease()}
cl_lastClicked=null}
cl_lastHovered=null;cl_mouseWasPressed=mouseIsPressed}
p5.prototype.registerMethod('post',p5.prototype.runGUI);function getTextBounds(m,font,size){let txt=document.createElement("span");document.body.appendChild(txt);txt.style.font=font;txt.style.fontSize=size+"px";txt.style.height='auto';txt.style.width='auto';txt.style.position='absolute';txt.style.whiteSpace='no-wrap';txt.innerHTML=m;let width=Math.ceil(txt.clientWidth);let height=Math.ceil(txt.clientHeight);document.body.removeChild(txt);return[width,height]}
function Clickable(){this.x=0;this.y=0;this.width=100;this.height=50;this.color="#FFFFFF";this.cornerRadius=10;this.strokeWeight=2;this.stroke="#000000";this.text="Press Me";this.textColor="#000000";this.textSize=12;this.textFont="sans-serif";this.textScaled=!1;this.image=null;this.fitImage=!1;this.imageScale=1.0;this.tint=null;this.noTint=!0;this.filter=null;this.updateTextSize=function(){if(this.textScaled){for(let i=this.height;i>0;i--){if(getTextBounds(this.text,this.textFont,i)[0]<=this.width&&getTextBounds(this.text,this.textFont,i)[1]<=this.height){console.log("textbounds: "+getTextBounds(this.text,this.font,i));console.log("boxsize: "+this.width+", "+this.height);this.textSize=i/2;break}}}}
this.updateTextSize();this.onHover=function(){}
this.onOutside=function(){}
this.onPress=function(){}
this.onRelease=function(){}
this.locate=function(x,y){this.x=x;this.y=y}
this.resize=function(w,h){this.width=w;this.height=h;this.updateTextSize()}
this.drawImage=function(){push();imageMode(CENTER);let centerX=this.x+this.width/2;let centerY=this.y+this.height/2;let imgWidth=this.width;let imgHeight=this.height;if(this.fitImage){let imageAspect=this.image.width/this.image.height;let buttonAspect=this.width/this.height;if(imageAspect>buttonAspect){imgWidth=this.width;imgHeight=this.height*(buttonAspect/imageAspect)}else{imgWidth=this.width*(imageAspect/buttonAspect);imgHeight=this.height}}
image(this.image,centerX,centerY,imgWidth*this.imageScale,imgHeight*this.imageScale);if(this.tint&&!this.noTint){tint(this.tint)}else{noTint()}
if(this.filter){filter(this.filter)}
pop()}
this.draw=function(){push();fill(this.color);stroke(this.stroke);strokeWeight(this.strokeWeight);rect(this.x,this.y,this.width,this.height,this.cornerRadius);fill(this.textColor);noStroke();if(this.image){this.drawImage()}
textAlign(CENTER,CENTER);textSize(this.textSize);textFont(this.textFont);text(this.text,this.x+this.width/2,this.y+this.height/2);if(mouseX>=this.x&&mouseY>=this.y&&mouseX<this.x+this.width&&mouseY<this.y+this.height){cl_lastHovered=this;if(mouseIsPressed&&!cl_mouseWasPressed)
cl_lastClicked=this}
pop()}
cl_clickables.push(this)}