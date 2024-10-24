const Epsilon="ε";class Estado{constructor(){this.Id_Edo=Estado.Cant_Edos,Estado.Cant_Edos+=1,this.Transiciones=new Set,this.Edo_Acept=!1,this.Token=-1}}Estado.Cant_Edos=0;class Transicion{constructor(s,t,o){this.Simbolo_Inferior=s,this.Simbolo_Superior=t,this.Edo_Destino=o}}class AFN{constructor(){this.Edo_Inicial=null,this.Estados=new Set,this.Alfabeto=new Set,this.Edos_Acept=new Set,this.ID_AFN=AFN.Cant_AFN,AFN.Cant_AFN+=1}static Cant_AFN=0;static Crear_Basico_AFN(s,t=null){let o=new AFN,i=new Estado,n=new Estado;if(null===t){let t=new Transicion(s,s,n);i.Transiciones.add(t),o.Alfabeto.add(s)}else{t<s&&([s,t]=[t,s]);let e=new Transicion(s,t,n);i.Transiciones.add(e);for(let i=s.charCodeAt(0);i<=t.charCodeAt(0);i++)o.Alfabeto.add(String.fromCharCode(i))}return n.Edo_Acept=!0,o.Edo_Inicial=i,o.Edos_Acept.add(n),o.Estados.add(i),o.Estados.add(n),o}Unir(s){let t=new Estado,o=new Estado;t.Transiciones.add(new Transicion("ε","ε",this.Edo_Inicial)),t.Transiciones.add(new Transicion("ε","ε",s.Edo_Inicial));for(let s of this.Edos_Acept)s.Transiciones.add(new Transicion("ε","ε",o)),s.Edo_Acept=!1;for(let t of s.Edos_Acept)t.Transiciones.add(new Transicion("ε","ε",o)),t.Edo_Acept=!1;return o.Edo_Acept=!0,this.Edo_Inicial=t,this.Edos_Acept.clear(),this.Edos_Acept.add(o),this.Estados=new Set([...this.Estados,...s.Estados]),this.Estados.add(t),this.Estados.add(o),this.Alfabeto=new Set([...this.Alfabeto,...s.Alfabeto]),this}Concatenar(s){for(let t of this.Edos_Acept)t.Transiciones=new Set([...t.Transiciones,...s.Edo_Inicial.Transiciones]),t.Edo_Acept=!1;return this.Estados=new Set([...this.Estados,...s.Estados]),this.Edos_Acept.clear(),this.Edos_Acept=new Set([...s.Edos_Acept]),this.Alfabeto=new Set([...this.Alfabeto,...s.Alfabeto]),this}Cerradura_Positiva(){let s=new Estado,t=new Estado;s.Transiciones.add(new Transicion("ε","ε",this.Edo_Inicial));for(let s of this.Edos_Acept)s.Transiciones.add(new Transicion("ε","ε",t)),s.Transiciones.add(new Transicion("ε","ε",this.Edo_Inicial)),s.Edo_Acept=!1;return t.Edo_Acept=!0,this.Edo_Inicial=s,this.Edos_Acept.clear(),this.Edos_Acept.add(t),this.Estados.add(s),this.Estados.add(t),this}Cerradura_Kleene(){let s=new Estado,t=new Estado;s.Transiciones.add(new Transicion("ε","ε",this.Edo_Inicial));for(let s of this.Edos_Acept)s.Transiciones.add(new Transicion("ε","ε",t)),s.Transiciones.add(new Transicion("ε","ε",this.Edo_Inicial)),s.Edo_Acept=!1;return s.Transiciones.add(new Transicion("ε","ε",t)),t.Edo_Acept=!0,this.Edo_Inicial=s,this.Edos_Acept.clear(),this.Edos_Acept.add(t),this.Estados.add(s),this.Estados.add(t),this}Opcional(){let s=new Estado,t=new Estado;s.Transiciones.add(new Transicion("ε","ε",this.Edo_Inicial)),s.Transiciones.add(new Transicion("ε","ε",t));for(let s of this.Edos_Acept)s.Transiciones.add(new Transicion("ε","ε",t)),s.Edo_Acept=!1;return t.Edo_Acept=!0,this.Edo_Inicial=s,this.Edos_Acept.clear(),this.Edos_Acept.add(t),this.Estados.add(s),this.Estados.add(t),this}static Cerradura_Epsilon(s){let t=new Set,o=[];for(o.push(s);o.length>0;){let s=o.pop();if(!t.has(s)){t.add(s);for(let i of s.Transiciones)"ε"===i.Simbolo_Inferior&&"ε"===i.Simbolo_Superior&&(t.has(i.Edo_Destino)||o.push(i.Edo_Destino))}}return t}static Cerradura(s){let t=new Set;for(let o of s)t=new Set([...t,...AFN.Cerradura_Epsilon(o)]);return t}static Mover(s,t){let o=new Set;for(let i of s)for(let s of i.Transiciones)s.Simbolo_Inferior<=t&&t<=s.Simbolo_Superior&&o.add(s.Edo_Destino);return o}static ir_a(s,t){let o=AFN.Mover(s,t);return AFN.Cerradura(o)}convertirAFD(){const s=new Map,t=[];let o=0;const i=AFN.Cerradura_Epsilon(this.Edo_Inicial),n=[...i].map((s=>s.Id_Edo)).sort().join(","),e=new ConjuntoDeEstados(i,o++);for(s.set(n,e),t.push(e);t.length>0;){const i=t.shift();for(const n of this.Alfabeto){const e=AFN.ir_a(i.Estados,n),a=AFN.Cerradura(e);if(0===a.size)continue;const d=[...a].map((s=>s.Id_Edo)).sort().join(",");if(!s.has(d)){const i=new ConjuntoDeEstados(a,o++);s.set(d,i),t.push(i)}}}const a=new AFD,d=new Map;for(const[t,o]of s.entries()){const s=new Estado_AFD(o.Id);s.esFinal=o.esEstadoAceptacion(this.Edos_Acept),o.contieneEstado(this.Edo_Inicial)&&(a.Edo_Inicial=s),d.set(o.Id,s),a.Estados.add(s)}for(const[t,o]of s.entries()){const t=d.get(o.Id);for(const i of this.Alfabeto){const n=AFN.ir_a(o.Estados,i),e=AFN.Cerradura(n);if(0===e.size)continue;const a=[...e].map((s=>s.Id_Edo)).sort().join(","),r=s.get(a);if(r){const s=d.get(r.Id);t.transiciones.set(i,s)}}}return a.Alfabeto=new Set(this.Alfabeto),a}}class ConjuntoDeEstados{constructor(s,t){this.Estados=s,this.Id=t}esEstadoAceptacion(s){for(const t of s)if(this.Estados.has(t))return!0;return!1}contieneEstado(s){return this.Estados.has(s)}}class Estado_AFD{constructor(s=null){this.id=s,this.transiciones=new Map,this.esFinal=!1}}class AFD{constructor(){this.Edo_Inicial=null,this.Estados=new Set,this.Alfabeto=new Set}static Cant_AFD=0}function setsIguales(s,t){if(s.size!==t.size)return!1;for(const o of s)if(!t.has(o))return!1;return!0}function buscarEstadoAFD(s,t){return s.get(t)||null}