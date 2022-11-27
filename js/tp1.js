/* Auteurs: Théodore Jordan (20147067), Milosh Devic (20158232)
lundi 04 novembre 2019

Ce programme a pour but de modifier certains aspects spécifiques des photos:
le rendre en noir et blanc, augmenter/baisser sa clarté, le rendre flou,
tracer les contours.
 */

/*Créer une nouvelle image, noire, avec les dimensions d'une
 * image donnée*/
function newImage(imageOriginale) {
    
	var ligne = [];

    for (var i = 0; i < imageOriginale.length; i++) {
        ligne.push([{ r: 0, g: 0, b: 0 }]);
    }

    var image = ligne;

    for (var i = 0; i < imageOriginale.length; i++) {
        for (var j = 0; j < imageOriginale[i].length; j++) {
            image[i].push({ r: 0, g: 0, b: 0 });
        }
    }
    return image;
}

//renvoie l'image en noir et blanc
function noirEtBlanc(imageOriginale) {
    
	//On copie l'image donnée pour servir de nouvelle image
	var img = imageOriginale;

    for (var i = 0; i < imageOriginale.length; i++){
        for (var j = 0; j < imageOriginale[i].length; j++){
			
			//formule pour rendre en noir et blanc une image
            var luminance =
                imageOriginale[i][j].r * 0.2126 +
                imageOriginale[i][j].g * 0.7152 +
                imageOriginale[i][j].b * 0.0722;
            
			//On arrondit au millième pour pouvoir effectuer les tests ultérieurement
            img[i][j].r = Math.round(luminance* 1000) / 1000;
            img[i][j].g = Math.round(luminance* 1000) / 1000;
            img[i][j].b = Math.round(luminance* 1000) / 1000;
        }
    }
    return img; 
}

//Modifie la clarté d'une image donnée
function correctionClarte(imageOriginale, quantite) {
    
	//On copie l'image donnée pour servir de nouvelle image
	var img = newImage(imageOriginale);

    for (var i = 0; i < imageOriginale.length; i++) {
        for (var j = 0; j < imageOriginale[i].length; j++) {
            
			//formule pour rendre l'image flou
			//Comme dans la dernière fonction : on arrondit
			img[i][j].r = Math.round((Math.pow((imageOriginale[i][j].r / 255), 
			quantite) * 255)* 100000000) / 100000000;
            img[i][j].g = Math.round((Math.pow((imageOriginale[i][j].g / 255), 
			quantite) * 255)* 100000000) / 100000000;
            img[i][j].b = Math.round((Math.pow((imageOriginale[i][j].b / 255), 
			quantite) * 255)* 100000000) / 100000000;
        }
    }
    return img; 
}

//Retourne une image floutée à un certain indice
function flou(imageOriginale, taille) {
    
	var img = newImage(imageOriginale);

    for (var i = 0; i < imageOriginale.length; i++) {
        for (var j = 0; j < imageOriginale[i].length; j++) {
            img[i][j].r = flouPixel('r', imageOriginale, i, j, taille);
            img[i][j].g = flouPixel('g', imageOriginale, i, j, taille);
            img[i][j].b = flouPixel('b', imageOriginale, i, j, taille);
        }
    }
    return img;
}

//donne nouvelle valeur de chaque pixel
function flouPixel(couleur, image, i, j, range) {
    
	var sum = 0;
	//On adapte le départ des boucles en fonction de l'indice donné
    var startX = i - Math.floor(range / 2);
	var startY = j - Math.floor(range / 2);

    for (var x = startX; x < startX + range; x++) {
        for (var y = startY; y < startY + range; y++) {
            if (x >= image.length || y >= image[0].length || x < 0 || y < 0) {
                continue;
            }
            sum += image[x][y][couleur] * 1 / Math.pow(range, 2);
        }
    }
	//On renvoie la nouvelle valeur du pixel pour son composant 'couleur'
    return sum;
}

//Détecte et trace les contours de l'image donnée sur une nouvelle image
function detectionContours(imageOriginale) {
    
	//newImage créé une nouvelle image de même dimension que imageOriginale
	var img = newImage(imageOriginale);
    noirEtBlanc(imageOriginale);

    for (var i = 0; i < imageOriginale.length; i++) {
        for (var j = 0; j < imageOriginale[i].length; j++) {
			
            var ponderationH = ponderation(imageOriginale, i, j, true);
            var ponderationV = ponderation(imageOriginale, j, i, false);
			
            /*On sélectionne la plus grande valeur entre les valeurs absolues
             * entre la pondération horizontale et verticale*/
            var intensiteC = Math.max(Math.abs(ponderationH), 
			Math.abs(ponderationV));//prends la plus grande valeur
            intensiteC = intensiteC > 255 ? 255 : intensiteC;

            img[i][j].r = intensiteC;
            img[i][j].g = intensiteC;
            img[i][j].b = intensiteC;
        }
    }
    return img;
}

/* Trouve la moyenne pondérée du pixel (i, j) dans l'image donnée
 * la fonction calcule la moyenne horizontale et verticale et ajuste les calcules
 * avec la booléenne 'hor' */
function ponderation(image, i, j, hor) {
   
    var moyenne = 0, indice, pixel; 

    for (var x = i - 1; x < i + 2; x++) {
        for (var y = j - 1; y < j + 2; y++) {
			
			//Si on dépasse les limites de l'image, on saute l'itération
            if (x < 0 || y < 0 ||
                ((hor ? x : y) >= image.length) || 
				((hor ? y : x) >= image[0].length)) {
                continue;
            }
            //On saute les cas inutiles où l'indice vaut 0
            if (y == j) {
                continue;
            }
            //On ajuste la valeur de l'indice en fonction de la position de i et j
            indice = (x == i ? 2 : 1) * (y < j ? (-1) : 1);
            
			//On prend la valeur, en fonction de hor, du pixel
			pixel = hor ? image[x][y].r : image[y][x].r; 
            
			//On ajoute à la moyenne la valeur du pixel fois l'indice
			moyenne += indice * pixel;
        }
    }
    return moyenne;
}

//Liste de tableaux utilisés pour  les tests:
var tab1 = [[{r: 10, g: 20, b: 10},{r: 10, g: 20, b: 10},{r: 20, g: 10, b: 20}],
           [{r: 20, g: 10, b: 10},{r: 255, g: 255, b: 255},{r: 20, g: 20, b: 20}],
           [{r: 10, g: 10, b: 10},{r: 30, g: 10, b: 40},{r: 10, g: 30, b: 15}]];

var tab2 = [[{r: 17.152, g: 17.152, b: 17.152},{r: 17.152, g: 17.152, b: 17.152},
           {r: 12.848, g: 12.848, b: 12.848}],
	       [{r: 12.126, g: 12.126, b: 12.126},{r: 255, g: 255, b: 255},
           {r: 20, g: 20, b: 20}],
		   [{r: 10, g: 10, b: 10},{r: 16.418, g: 16.418, b: 16.418},
           {r: 24.665, g: 24.665, b: 24.665}]];

var tab3 = [[{r: 10, g: 15, b: 5}]];

var tab4 = [[{"r":13.215,"g":13.215,"b":13.215}]];

var tab5 = [[{r:0,g:0,b:0},{r:0,g:0,b:0},{r:0,g:0,b:0},
           {r:0,g:0,b:0}],
	       [{r:0,g:0,b:0},{r:0,g:0,b:0},
           {r:0,g:0,b:0},{r:0,g:0,b:0}],
           [{r:0,g:0,b:0},{r:0,g:0,b:0},{r:0,g:0,b:0},
           {r:0,g:0,b:0}]]

var tab6 = [[{"r":0,"g":0,"b":0},{"r":0,"g":0,"b":0},{"r":0,"g":0,"b":0},
		   {"r":0,"g":0,"b":0}],
		   [{"r":0,"g":0,"b":0},{"r":0,"g":0,"b":0},{"r":0,"g":0,"b":0},
		   {"r":0,"g":0,"b":0}],[{"r":0,"g":0,"b":0},{"r":0,"g":0,"b":0},
		   {"r":0,"g":0,"b":0},{"r":0,"g":0,"b":0}]];

var tab7 =  [[{r: 255, g: 255, b: 255},{r: 255, g: 255, b: 255},
            {r: 255, g: 255, b: 255}],
            [{r: 255, g: 255, b: 255},{r: 255, g: 255, b: 255},
            {r: 255, g: 255, b: 255}],
            [{r: 255, g: 255, b: 255},{r: 255, g: 255, b: 255},
            {r: 255, g: 255, b: 255}]];

var tab8 =  [[{r: 255, g: 255, b: 255},{r: 255, g: 255, b: 255},
            {r: 255, g: 255, b: 255}],
            [{r: 255, g: 255, b: 255},{r: 255, g: 255, b: 255},
            {r: 255, g: 255, b: 255}],
            [{r: 255, g: 255, b: 255},{r: 255, g: 255, b: 255},
            {r: 255, g: 255, b: 255}]];

var tab9 =  [[{"r":66.13440859,"g":66.13440859,"b":66.13440859},
			{"r":66.13440859,"g":66.13440859,"b":66.13440859},
			{"r":57.23844862,"g":57.23844862,"b":57.23844862},
			{"r":0,"g":0,"b":0}],
			[{"r":55.60692403,"g":55.60692403,"b":55.60692403},
			{"r":255,"g":255,"b":255},
			{"r":71.41428429,"g":71.41428429,"b":71.41428429},
			{"r":0,"g":0,"b":0}],
			[{"r":50.49752469,"g":50.49752469,"b":50.49752469},
			{"r":64.70386387,"g":64.70386387,"b":64.70386387},
			{"r":79.30684081,"g":79.30684081,"b":79.30684081},
			{"r":0,"g":0,"b":0}]]

var tab10 = [[{"r":4.44838187,"g":4.44838187,"b":4.44838187},
			{"r":4.44838187,"g":4.44838187,"b":4.44838187},
			{"r":2.88391995,"g":2.88391995,"b":2.88391995},
			{"r":0,"g":0,"b":0}],
			[{"r":2.64427279,"g":2.64427279,"b":2.64427279},
			{"r":255,"g":255,"b":255},
			{"r":5.60112034,"g":5.60112034,"b":5.60112034},
			{"r":0,"g":0,"b":0}],
			[{"r":1.98029509,"g":1.98029509,"b":1.98029509},
			{"r":4.16591387,"g":4.16591387,"b":4.16591387},
			{"r":7.67099305,"g":7.67099305,"b":7.67099305},
			{"r":0,"g":0,"b":0}]]

var tab11 = [{r: 10, g: 15, b: 5}];

var tab12 = [[{r: 10},{r: 10},{r: 20}],
            [{r: 20},{r: 15},{r: 20}],
            [{r: 10},{r: 30},{r: 10}]];

var tab13 = [[{r: 10},{r: 10}],[{r: 10},{r: 15}]];

var tab14 = [[{r: 10, g: 10, b: 10},{r: 10, g: 10, b: 10}],
            [{r: 10, g: 10, b: 10},{r: 10, g: 10, b: 10}]];

var tab15 = [[{"r":2.5,"g":2.5,"b":2.5},{"r":5,"g":5,"b":5},
			{"r":0,"g":0,"b":0}],
			[{"r":5,"g":5,"b":5},{"r":10,"g":10,"b":10},
			{"r":0,"g":0,"b":0}]];

var tab16 = [[{"r":1.4683333333333333,"g":1.4683333333333333,"b":1.4683333333333333},
			{"r":0,"g":0,"b":0}]];

var tab17 = [[{r: 0, g: 0, b: 0},{r: 0, g: 0, b: 0},{r: 0, g: 0, b: 0}],
            [{r: 0, g: 0, b: 0},{r: 0, g: 0, b: 0},{r: 0, g: 0, b: 0}],
            [{r: 0, g: 0, b: 0},{r: 0, g: 0, b: 0},{r: 0, g: 0, b: 0}]];

var tab19 = [[{"r":0,"g":0,"b":0}]];

var tab20 = [[{r: 10, g: 10, b: 10},{r: 10, g: 10, b: 10}],
            [{r: 10, g: 10, b: 10},{r: 10, g: 10, b: 10}]];

var tab21 = [[{"r":30,"g":30,"b":30},{"r":30,"g":30,"b":30},{"r":0,"g":0,"b":0}],
			[{"r":30,"g":30,"b":30},{"r":30,"g":30,"b":30},{"r":0,"g":0,"b":0}]];

var tab22 = [[{"r":17.152,"g":17.152,"b":17.152},
			{"r":17.152,"g":17.152,"b":17.152},{"r":12.848,"g":12.848,"b":12.848},
			{"r":0,"g":0,"b":0}],
			[{"r":12.126,"g":12.126,"b":12.126},{"r":255,"g":255,"b":255},
			{"r":20,"g":20,"b":20},{"r":0,"g":0,"b":0}],
			[{"r":10,"g":10,"b":10},{"r":16.418,"g":16.418,"b":16.418},
			{"r":24.665,"g":24.665,"b":24.665},{"r":0,"g":0,"b":0}]];

var tab23 = [[{"r":0,"g":0,"b":0},{"r":0,"g":0,"b":0},{"r":0,"g":0,"b":0},
			{"r":0,"g":0,"b":0}],
			[{"r":0,"g":0,"b":0},{"r":0,"g":0,"b":0},{"r":0,"g":0,"b":0},
			{"r":0,"g":0,"b":0}],
			[{"r":0,"g":0,"b":0},{"r":0,"g":0,"b":0},{"r":0,"g":0,"b":0},
			{"r":0,"g":0,"b":0}]];
			
var tab24 = [[{"r":255,"g":255,"b":255},{"r":255,"g":255,"b":255},
			{"r":255,"g":255,"b":255},{"r":0,"g":0,"b":0}],
			[{"r":255,"g":255,"b":255},{"r":0,"g":0,"b":0},
			{"r":255,"g":255,"b":255},{"r":0,"g":0,"b":0}],
			[{"r":255,"g":255,"b":255},{"r":255,"g":255,"b":255},
			{"r":255,"g":255,"b":255},{"r":0,"g":0,"b":0}]];

//vérifier le code
function tests(a, b) {
    if (a != b) {
        console.log("ERROR : " + a + " != " + b);
    } else {
    	console.log("c'est bon");
    }
};

//tests de noirEtBlanc
tests(JSON.stringify(noirEtBlanc(tab1)),JSON.stringify(tab2));
tests(JSON.stringify(noirEtBlanc(tab5)),JSON.stringify(tab6));
tests(JSON.stringify(noirEtBlanc(tab7)),JSON.stringify(tab8));
tests(JSON.stringify(noirEtBlanc(tab3)),JSON.stringify(tab4));

//tests de correctionClarte
tests(JSON.stringify(correctionClarte(tab1, 0.5)),JSON.stringify(tab9));
tests(JSON.stringify(correctionClarte(tab1, 1.5)),JSON.stringify(tab10));
tests(JSON.stringify(correctionClarte(tab1, 1)),JSON.stringify(tab22));

//tests de flouPixel
tests(JSON.stringify(flouPixel('r',tab12,1,1,3)),JSON.stringify(16.111111111111114));
tests(JSON.stringify(flouPixel('r',tab13,1,1,2)),JSON.stringify(45/4));

//tests de flou
tests(JSON.stringify(flou(tab14, 2)),JSON.stringify(tab15));
tests(JSON.stringify(flou(tab3, 3)),JSON.stringify(tab16));

//tests de newImage
tests(JSON.stringify(newImage(tab1)),JSON.stringify(tab6));
tests(JSON.stringify(newImage(tab1).length),JSON.stringify(3));
tests(JSON.stringify(newImage(tab1)[1][2].r),JSON.stringify(0));

//tests de ponderation
tests(JSON.stringify(ponderation(tab1,1,1,true)),JSON.stringify(26.109));
tests(JSON.stringify(ponderation(tab1,1,1,false)),JSON.stringify(3.1969999999999956));

//tests de detectionContours
tests(JSON.stringify(detectionContours(tab20)),JSON.stringify(tab21));
tests(JSON.stringify(detectionContours(tab11)),JSON.stringify(tab19));
tests(JSON.stringify(detectionContours(tab17)),JSON.stringify(tab23));
tests(JSON.stringify(detectionContours(tab7)),JSON.stringify(tab24));