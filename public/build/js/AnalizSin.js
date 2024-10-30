const TOKEN={OR:10,CONCAT:20,CERRPOS:30,CERRKLEEN:40,CERROPC:50,LPAREN:60,SPACE:70,RPAREN:80,LCORCH:90,RCORCH:100,DASH:110,SIMB:120,END:0};class Nodo{constructor(e,t=[]){this.name=e,this.children=t}}class ExpresionRegular{constructor(e="",t=null){this.AL=new AnalizadorLexico(e,t),this.result=null,this.ER=e,this.tree=new Nodo("E")}getTree(){return this.tree}getResult(){return this.result}getER(){return this.ER}setER(e){this.ER=e,this.AL.setSigma(e)}parse(){const e=new AFN,t=[];if(this.E(e,t)){this.tree.children=t;return this.AL.yylex()===TOKEN.END&&(this.result=e,!0)}return!1}E(e,t){const s=[];if(this.T(e,s)){t.push(new Nodo("T",s));const n=[];if(this.Ep(e,n))return t.push(new Nodo("E'",n)),!0}return!1}Ep(e,t){if(this.AL.yylex()===TOKEN.OR){t.push(new Nodo("|"));const s=new AFN,n=[];if(this.T(s,n)){t.push(new Nodo("T",n));const o=[];if(this.Ep(s,o))return t.push(new Nodo("E'",o)),e.Unir(s),!0}return!1}return this.AL.undoToken(),!0}T(e,t){const s=[];if(this.C(e,s)){t.push(new Nodo("C",s));const n=[];if(this.Tp(e,n))return t.push(new Nodo("T'",n)),!0}return!1}Tp(e,t){if(this.AL.yylex()===TOKEN.CONCAT){t.push(new Nodo("&"));const s=new AFN,n=[];if(this.C(s,n)){t.push(new Nodo("C",n));const o=[];if(this.Tp(s,o))return t.push(new Nodo("T'",o)),e.Concatenar(s),!0}return!1}return this.AL.undoToken(),!0}C(e,t){const s=[];if(this.F(e,s)){t.push(new Nodo("F",s));const n=[];if(this.Cp(e,n))return t.push(new Nodo("C'",n)),!0}return!1}Cp(e,t){switch(this.AL.yylex()){case TOKEN.CERRPOS:return t.push(new Nodo("+")),!!this.Cp(e,[])&&(e.Cerradura_Positiva(),!0);case TOKEN.CERRKLEEN:return t.push(new Nodo("*")),!!this.Cp(e,[])&&(e.Cerradura_Kleene(),!0);case TOKEN.CERROPC:return t.push(new Nodo("?")),!!this.Cp(e,[])&&(e.Opcional(),!0);default:return this.AL.undoToken(),!0}}F(e,t){switch(this.AL.yylex()){case TOKEN.LPAREN:t.push(new Nodo("("));const s=[];if(this.E(e,s)){t.push(new Nodo("E",s));if(this.AL.yylex()===TOKEN.RPAREN)return t.push(new Nodo(")")),!0}return!1;case TOKEN.LCORCH:t.push(new Nodo("["));if(this.AL.yylex()===TOKEN.SIMB){const s=this.AL.getLexema(),n="\\"===s[0]?s[1]:s[0];t.push(new Nodo(n));if(this.AL.yylex()===TOKEN.DASH){t.push(new Nodo("-"));if(this.AL.yylex()===TOKEN.SIMB){const s=this.AL.getLexema(),o="\\"===s[0]?s[1]:s[0];t.push(new Nodo(o));if(this.AL.yylex()===TOKEN.RCORCH)return t.push(new Nodo("]")),e=AFN.Crear_Basico_AFN(n,o),!0}}}return!1;case TOKEN.SIMB:const n=this.AL.getLexema(),o="\\"===n[0]?n[1]:n[0];return t.push(new Nodo(o)),e=AFN.Crear_Basico_AFN(o),!0;default:return!1}}}