class Moon {
    #T;
    #offset;
    #latitude;
    #longitude;

    #UT;            // Время по Гринвичу в часах
    #d;             // Кол-во дней с 0,0 TDT января 2000 года

    #w;             // Долгота перигелия
    #a;             // Среднее расстояние, а.е.
    #i;             // Наклонение
    #N;             // Долгота восходящего узла
    #oblecl;        // Наклон эклиптики
    #e;             // Эксцентриситет
    #M;             // Средняя аномалия Луны
    #Lm;            // Средняя долгота Луны
    #E;             // Эксцентрическая аномалия

    #Ms;            // Средняя аномалия Солнца
    #ws;            // Долгота перигелия Солнца
    #Ls;            // Средняя долгота Солнца

    #F;             // Аргумент широты Луны
    #D;             // Средняя элонгация Луны

    #xInPlaneOfEcliptic;
    #yInPlaneOfEcliptic;       // Координаты в плоскости эклиптики
    #r;             // Гелиоцентрическое расстояние
    #lon;           // Долгота в эклиптических координатах
    #lat            // Широта в эклиптических координатах
    #distance       // Расстояние в эклиптических координатах
    #v;             // Истинная аномалия
    #xEcliptic;
    #yEcliptic;
    #zEcliptic;             // Эклиптические прямоугольные координаты
    #xEquatorial;
    #yEquatorial;
    #zEquatorial;       // Экваториальные прямоугольные координаты
    #rEquatorial;
    #RAEquatorial;
    #DeclEquatorial;   // Экваториальные координаты

    constructor(T = new Date(), offset = new Date().getTimezoneOffset() / 60, latitude = 0, longitude = 0) {
        this.#T = T;
        this.#offset = offset;
        this.#latitude = latitude;
        this.#longitude = longitude;
    }

    clone() {
        return new Moon(new Date(this.#T), this.#offset, this.#latitude, this.#longitude);
    }

    // Приводит значение в градусах в промежуток от 0 до 360
    #rev(x, d) {
        return x - Math.floor(x / d) * d;
    }

    printData() {
        this.#calculateEquatorialCoordinates();
        console.log(`N = ${this.#N}`);
        console.log(`i = ${this.#i}`);
        console.log(`w = ${this.#w}`);
        console.log(`a = ${this.#a}`);
        console.log(`e = ${this.#e}`);
        console.log(`M = ${this.#M}`);
        console.log("-------------------------------------------");
        console.log(`Ms = ${this.#Ms}`);
        console.log(`Ls = ${this.#Ls}`);
        console.log(`Lm = ${this.#Lm}`);
        console.log(`ws = ${this.#ws}`);
        console.log(`D = ${this.#D}`);
        console.log(`F = ${this.#F}`);
        console.log(`E = ${this.#E}`);
        console.log("-------------------------------------------");
        console.log(`x = ${this.#xInPlaneOfEcliptic}`);
        console.log(`y = ${this.#yInPlaneOfEcliptic}`);
        console.log("-------------------------------------------");
        console.log(`r = ${this.#r}`);
        console.log(`v = ${this.#v}`);
        console.log("-------------------------------------------");
        console.log(`xeclip = ${this.#xEcliptic}`);
        console.log(`yeclip = ${this.#yEcliptic}`);
        console.log(`zeclip = ${this.#zEcliptic}`);
        console.log("-------------------------------------------");
        console.log(`lon = ${this.#lon}`);
        console.log(`lat = ${this.#lat}`);
        console.log(`distance = ${this.#distance}`);
        console.log("-------------------------------------------");
        console.log(`xequat = ${this.#xEquatorial}`);
        console.log(`yequat = ${this.#yEquatorial}`);
        console.log(`zequat = ${this.#zEquatorial}`);
        console.log("-------------------------------------------");
        console.log(`rEquatorial = ${this.#rEquatorial}`);
        console.log(`RA = ${this.#RAEquatorial}`);
        console.log(`Decl = ${this.#DeclEquatorial}`);
    }

    #calculateTimeParams() {
        this.#UT = this.#T.getHours() + this.#T.getMinutes() / 60;
        this.#UT += this.#offset * -1;
        this.#d = 367 * this.#T.getFullYear() - Math.floor(7 * (this.#T.getFullYear() + Math.floor(((this.#T.getMonth() + 1) + 9) / 12)) / 4) + Math.floor((275 * (this.#T.getMonth() + 1)) / 9) + this.#T.getDate() - 730530;
    }

    #calculateKeplerOrbit() {
        this.#calculateTimeParams();
        this.#N = this.#rev(125.1228 - 0.0529538083 * this.#d, 360);
        this.#i = 5.1454;
        this.#w = this.#rev(318.0634 + 0.1643573223 * this.#d, 360);
        this.#a = 60.2666;
        this.#e = 0.054900;
        this.#M = this.#rev(115.3654 + 13.0649929509 * this.#d, 360);
        this.#oblecl = 23.4393 - 3.563E-7 * this.#d;

        this.#ws = this.#rev(282.9404 + 4.70935E-5 * this.#d, 360);
        this.#Ms = this.#rev(356.0470 + 0.9856002585 * this.#d, 360);
        this.#Lm = this.#rev(this.#N + this.#w + this.#M, 360);
        this.#Ls = this.#rev(this.#ws + this.#Ms, 360);
        this.#D = this.#rev(this.#Lm - this.#Ls, 360);
        this.#F = this.#rev(this.#Lm - this.#N, 360);

        this.#E = this.#M + (180 / Math.PI) * this.#e * Math.sin(this.#M * DEGRAD) * (1 + this.#e * Math.cos(this.#M * DEGRAD));
        let E1;
        for (let i = 0; i < 10; i++) {
            E1 = this.#E - (this.#E - (180 / Math.PI) * this.#e * Math.sin(this.#E * DEGRAD) - this.#M) / (1 - this.#e * Math.cos(this.#E * DEGRAD));
            this.#E = E1;
        }
    }

    #calculateEclipticCoordinates() {
        this.#calculateKeplerOrbit();
        this.#xInPlaneOfEcliptic = this.#a * (Math.cos(this.#E * DEGRAD) - this.#e);
        this.#yInPlaneOfEcliptic = this.#a * (Math.sin(this.#E * DEGRAD) * Math.sqrt(1 - this.#e * this.#e));

        this.#r = Math.sqrt(this.#xInPlaneOfEcliptic * this.#xInPlaneOfEcliptic + this.#yInPlaneOfEcliptic * this.#yInPlaneOfEcliptic);
        this.#v = Math.atan2(this.#yInPlaneOfEcliptic, this.#xInPlaneOfEcliptic) * RADEG;

        this.#xEcliptic = this.#r * (Math.cos(this.#N * DEGRAD) * Math.cos((this.#v + this.#w) * DEGRAD) - Math.sin(this.#N * DEGRAD) * Math.sin((this.#v + this.#w) * DEGRAD) * Math.cos(this.#i * DEGRAD));
        this.#yEcliptic = this.#r * (Math.sin(this.#N * DEGRAD) * Math.cos((this.#v + this.#w) * DEGRAD) + Math.cos(this.#N * DEGRAD) * Math.sin((this.#v + this.#w) * DEGRAD) * Math.cos(this.#i * DEGRAD));
        this.#zEcliptic = this.#r * Math.sin((this.#v + this.#w) * DEGRAD) * Math.sin(this.#i * DEGRAD);

        this.#lon = this.#rev(RADEG * Math.atan2(this.#yEcliptic, this.#xEcliptic), 360);
        this.#lat = RADEG * Math.atan2(this.#zEcliptic, Math.sqrt(this.#xEcliptic * this.#xEcliptic + this.#yEcliptic * this.#yEcliptic));
        this.#r = Math.sqrt(this.#xEcliptic * this.#xEcliptic + this.#yEcliptic * this.#yEcliptic + this.#zEcliptic * this.#zEcliptic);

        // Исправления для долготы, широты и расстояния
        this.#lon += -1.274 * Math.sin(DEGRAD * (this.#M - 2 * this.#D))
            + 0.658 * Math.sin(DEGRAD * 2 * this.#D)
            - 0.186 * Math.sin(DEGRAD * this.#Ms)
            - 0.059 * Math.sin(DEGRAD * (2 * this.#M - 2 * this.#D))
            - 0.057 * Math.sin(DEGRAD * (this.#M - 2 * this.#D + this.#Ms))
            + 0.053 * Math.sin(DEGRAD * (this.#M + 2 * this.#D))
            + 0.046 * Math.sin(DEGRAD * (2 * this.#D - this.#Ms))
            + 0.041 * Math.sin(DEGRAD * (this.#M - this.#Ms))
            - 0.035 * Math.sin(DEGRAD * this.#D)
            - 0.031 * Math.sin(DEGRAD * (this.#M + this.#Ms))
            - 0.015 * Math.sin(DEGRAD * (2 * this.#F - 2 * this.#D))
            + 0.011 * Math.sin(DEGRAD * (this.#M - 4 * this.#D));
        this.#lat += -0.173 * Math.sin(DEGRAD * (this.#F - 2 * this.#D))
            - 0.055 * Math.sin(DEGRAD * (this.#M - this.#F - 2 * this.#D))
            - 0.046 * Math.sin(DEGRAD * (this.#M + this.#F - 2 * this.#D))
            + 0.033 * Math.sin(DEGRAD * (this.#F + 2 * this.#D))
            + 0.017 * Math.sin(DEGRAD * (2 * this.#M + this.#F));
        this.#r += -0.58 * Math.cos(DEGRAD * (this.#M - 2 * this.#D))
            - 0.46 * Math.cos(DEGRAD * 2 * this.#D);

        this.#xEcliptic = this.#r * Math.cos(this.#lon * DEGRAD) * Math.cos(this.#lat * DEGRAD);
        this.#yEcliptic = this.#r * Math.sin(this.#lon * DEGRAD) * Math.cos(this.#lat * DEGRAD);
        this.#zEcliptic = this.#r * Math.sin(this.#lat * DEGRAD);

    }

    #calculateRectangularEquatorialCoordinates() {
        this.#calculateEclipticCoordinates();
        this.#xEquatorial = this.#xEcliptic;
        this.#yEquatorial = this.#yEcliptic * Math.cos(this.#oblecl * DEGRAD) - this.#zEcliptic * Math.sin(this.#oblecl * DEGRAD);
        this.#zEquatorial = this.#yEcliptic * Math.sin(this.#oblecl * DEGRAD) + this.#zEcliptic * Math.cos(this.#oblecl * DEGRAD);
    }

    #calculateEquatorialCoordinates() {
        this.#calculateRectangularEquatorialCoordinates();
        //вычислим прямое восхождение и склонение Солнца в градусах
        this.#rEquatorial = Math.sqrt(this.#xEquatorial * this.#xEquatorial + this.#yEquatorial * this.#yEquatorial + this.#zEquatorial * this.#zEquatorial);
        this.#RAEquatorial = this.#rev(Math.atan2(this.#yEquatorial, this.#xEquatorial) * RADEG, 360);
        this.#DeclEquatorial = Math.atan2(this.#zEquatorial, Math.sqrt(this.#xEquatorial * this.#xEquatorial + this.#yEquatorial * this.#yEquatorial)) * RADEG;
    }

    get rectangularEquatorialCoordinates(){
        this.#calculateEquatorialCoordinates();
        return { x : this.#xEquatorial / this.#rEquatorial, y : this.#yEquatorial / this.#rEquatorial, z : this.#zEquatorial / this.#rEquatorial };
    }

    get T() {
        return this.#T;
    }

    set T(value) {
        this.#T = value;
    }
}