# Informe


## Integrantes:

    - Lucía Daniela Lotumolo Sueldo
    - Nicolás Xynos
    - Juan Ignacio Méndez



---
## Experiencia y organización del proyecto
---

Para el desarrollo de las funcionalidades de la aplicación nos basamos en la explicación de los links
propuestos por la cátedra, con soporte adicional de otras fuentes relacionadas. Testeamos cada parte
por separado para evitar arrastrar errores, y a medida que lograbamos lo querido, ibamos juntando la
llamada a funciones en el FeedReaderMain. Allí extraimos del archivo .json lo necesario para realizar
un pedido HTTP de un determinado feed. Para cada Feed le proporcionamos al usuario información sobre los
artículos que pertenecen al mismo. Además de esto, el usuario tiene la posibilidad de obtener una lista 
de las entidades nombradas y su frecuencia con la que aparecen en el feed, como asi también artículo por artculo. Para esto tuvimos que modifcar el archivo Article agregando un nuevo método que manipule la lista de entidades nombradas y agregagamos algunos atributos al archivo Feed para contabilizar las frecuencias de cada categoria de entidades y las funciones para computar e imprimir.
Algunas entidades nombradas pueden ser clasificadas por categoría (Persona, Lugar, Organizacion, Producto) 
y tema (Cultura, Deportes, Politica, Otros), pero esto solo sucederá si dicha entidad nombrada pertence a 
nuestra  base de datos (diccionario). Para permitir esta categorización fue necesario crear clases y subclases 
nuevas, agregar métodos que pueda manipular una heurística y cambiar el método que computa las entidades para 
tener en cuenta esta nueva jerarquía. Esta categorización también se mostrara por pantalla.
Ahora bien, el programa tiene dos formas de encontrar entidades nombradas en un artículo, y cambiar de una 
a la otra requiera modificar una sola línea en el código. Esto se debe a que ambas heurísticas heredan el 
mismo método isEntity que es el principal para computar entidades nombradas.

