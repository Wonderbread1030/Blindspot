import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   CAR DATABASE — 553 models, 19 countries
   Format: [make, model, year, countryCode, body, drive, motor]
   To expand: just add more entries to this array.
   For production: move to separate file and import.
   ═══════════════════════════════════════════════════════════════════ */
const RAW = [
// ══════════════════════════════ JAPAN ══════════════════════════════
// Toyota
["Toyota","Supra (A80)",1993,"JP","Coupe","RWD","I6",1993,2002,320],
["Toyota","Supra (A90)",2019,"JP","Coupe","RWD","I6",2019,2025,382],
["Toyota","Supra (A70)",1986,"JP","Coupe","RWD","I6",1986,1993,230],
["Toyota","AE86 Trueno",1983,"JP","Coupe","RWD","I4",1983,1987,128],
["Toyota","2000GT",1967,"JP","Coupe","RWD","I6",1967,1970,150],
["Toyota","MR2 Turbo (SW20)",1991,"JP","Coupe","RWD","I4",1989,1999,200],
["Toyota","MR2 (AW11)",1984,"JP","Coupe","RWD","I4",1984,1989,112],
["Toyota","Celica GT-Four (ST205)",1994,"JP","Coupe","AWD","I4",1994,1999,242],
["Toyota","Celica (T230)",1999,"JP","Coupe","FWD","I4",1999,2006,180],
["Toyota","Land Cruiser FJ40",1960,"JP","SUV","4WD","I6",1960,1984,135],
["Toyota","Land Cruiser 80",1990,"JP","SUV","4WD","I6",1990,1997,213],
["Toyota","Land Cruiser 100",1998,"JP","SUV","4WD","V8",1998,2007,235],
["Toyota","Land Cruiser 200",2008,"JP","SUV","4WD","V8",2008,2021,381],
["Toyota","Land Cruiser 300",2021,"JP","SUV","4WD","V6",2021,2025,409],
["Toyota","GR Yaris",2020,"JP","Hatchback","AWD","I3",2020,2025,268],
["Toyota","GR86",2022,"JP","Coupe","RWD","Flat-4",2022,2025,228],
["Toyota","GR Corolla",2023,"JP","Hatchback","AWD","I3",2023,2025,300],
["Toyota","Soarer (Z30)",1991,"JP","Coupe","RWD","I6",1991,2000,276],
["Toyota","Chaser JZX100",1996,"JP","Sedan","RWD","I6",1996,2001,280],
["Toyota","Century (V12)",1997,"JP","Sedan","RWD","V12",1997,2017,276],
["Toyota","Sports 800",1965,"JP","Coupe","RWD","Flat-4",1965,1969,45],
["Toyota","Starlet Turbo (EP82)",1990,"JP","Hatchback","FWD","I4",1989,1995,133],
["Toyota","4Runner TRD Pro (5th Gen)",2015,"JP","SUV","4WD","V6",2010,2025,270],
["Toyota","Tacoma TRD Pro (3rd Gen)",2017,"JP","Truck","4WD","V6",2016,2023,278],
["Toyota","FJ Cruiser",2006,"JP","SUV","4WD","V6",2006,2014,260],
["Toyota","Sera",1990,"JP","Coupe","FWD","I4",1990,1995,108],
["Toyota","Mark II (JZX90)",1992,"JP","Sedan","RWD","I6",1992,1996,280],
["Toyota","Crown Athlete",2003,"JP","Sedan","RWD","I6",2003,2008,256],
["Toyota","RAV4 Prime",2021,"JP","SUV","AWD","I4",2021,2025,302],
["Toyota","Hilux (4th Gen)",1983,"JP","Truck","4WD","I4",1983,1988,97],
["Toyota","Prius (2nd Gen)",2004,"JP","Hatchback","FWD","I4",2004,2009,110],
["Toyota","bZ4X",2022,"JP","SUV","AWD","Electric",2022,2025,215],
["Toyota","Camry (XV70)",2018,"JP","Sedan","FWD","I4",2018,2024,206],
["Toyota","Corolla AE92 GT-S",1988,"JP","Coupe","FWD","I4",1987,1992,130],
["Toyota","Tundra TRD Pro (3rd Gen)",2022,"JP","Truck","4WD","V6",2022,2025,389],
["Toyota","Scion FR-S",2013,"JP","Coupe","RWD","Flat-4",2012,2016,200],
["Toyota","Supra (A60)",1981,"JP","Coupe","RWD","I6",1981,1986,160],
["Toyota","Tercel 4WD",1983,"JP","Wagon","4WD","I4",1983,1988,62],
["Toyota","Cressida (X80)",1989,"JP","Sedan","RWD","I6",1988,1992,190],
// Nissan
["Nissan","Skyline GT-R R34",1999,"JP","Coupe","AWD","I6",1999,2002,276],
["Nissan","Skyline GT-R R33",1995,"JP","Coupe","AWD","I6",1995,1998,276],
["Nissan","Skyline GT-R R32",1989,"JP","Coupe","AWD","I6",1989,1994,276],
["Nissan","GT-R R35",2009,"JP","Coupe","AWD","V6",2009,2025,485],
["Nissan","GT-R NISMO (R35)",2014,"JP","Coupe","AWD","V6",2014,2025,600],
["Nissan","Fairlady Z (RZ34)",2023,"JP","Coupe","RWD","V6",2023,2025,400],
["Nissan","370Z",2009,"JP","Coupe","RWD","V6",2009,2020,332],
["Nissan","350Z",2003,"JP","Coupe","RWD","V6",2003,2009,287],
["Nissan","300ZX Twin Turbo (Z32)",1990,"JP","Coupe","RWD","V6",1990,1996,300],
["Nissan","Silvia S15",1999,"JP","Coupe","RWD","I4",1999,2002,250],
["Nissan","Silvia S13",1988,"JP","Coupe","RWD","I4",1988,1994,180],
["Nissan","240SX (S14)",1995,"JP","Coupe","RWD","I4",1994,1998,155],
["Nissan","Pulsar GTI-R",1990,"JP","Hatchback","AWD","I4",1990,1994,227],
["Nissan","Stagea RS Four",1997,"JP","Wagon","AWD","I6",1996,2001,276],
["Nissan","Patrol (Y62)",2010,"JP","SUV","4WD","V8",2010,2025,400],
["Nissan","Figaro",1991,"JP","Convertible","FWD","I4",1991,1991,76],
["Nissan","Leaf NISMO",2018,"JP","Hatchback","FWD","Electric",2018,2023,148],
["Nissan","Ariya",2022,"JP","SUV","AWD","Electric",2022,2025,389],
["Nissan","Frontier PRO-4X (D41)",2022,"JP","Truck","4WD","V6",2022,2025,310],
["Nissan","Skyline 2000GT-R (KPGC10)",1971,"JP","Coupe","RWD","I6",1969,1972,160],
["Nissan","Maxima SE (A32)",1995,"JP","Sedan","FWD","V6",1995,1999,190],
["Nissan","Sentra SE-R (B13)",1991,"JP","Sedan","FWD","I4",1991,1994,140],
["Nissan","Pathfinder (R51)",2005,"JP","SUV","4WD","V6",2005,2012,270],
["Nissan","IDx NISMO Concept",2013,"JP","Coupe","RWD","I4",2013,2013,200],
["Nissan","Pao",1989,"JP","Hatchback","FWD","I4",1989,1991,52],
// Honda
["Honda","NSX (NA1)",1990,"JP","Coupe","RWD","V6",1990,2005,270],
["Honda","NSX Type S (NC1)",2022,"JP","Coupe","AWD","V6",2017,2022,600],
["Honda","S2000 (AP1)",1999,"JP","Roadster","RWD","I4",1999,2003,240],
["Honda","S2000 (AP2)",2004,"JP","Roadster","RWD","I4",2004,2009,237],
["Honda","Civic Type R (EK9)",1997,"JP","Hatchback","FWD","I4",1997,2000,185],
["Honda","Civic Type R (FD2)",2007,"JP","Sedan","FWD","I4",2007,2010,225],
["Honda","Civic Type R (FK8)",2017,"JP","Hatchback","FWD","I4",2017,2021,306],
["Honda","Civic Type R (FL5)",2023,"JP","Hatchback","FWD","I4",2023,2025,315],
["Honda","Integra Type R (DC2)",1995,"JP","Coupe","FWD","I4",1995,2001,195],
["Honda","Integra Type R (DC5)",2001,"JP","Coupe","FWD","I4",2001,2006,220],
["Honda","Beat",1991,"JP","Roadster","RWD","I3",1991,1996,64],
["Honda","S660",2015,"JP","Roadster","RWD","I3",2015,2022,64],
["Honda","S800",1966,"JP","Roadster","RWD","I4",1966,1970,70],
["Honda","CRX Si",1988,"JP","Coupe","FWD","I4",1988,1991,108],
["Honda","Prelude Si (BB4)",1991,"JP","Coupe","FWD","I4",1991,1996,160],
["Honda","Prelude (BB6)",1997,"JP","Coupe","FWD","I4",1997,2001,195],
["Honda","Accord Euro R (CL7)",2002,"JP","Sedan","FWD","I4",2002,2008,220],
["Honda","City Turbo II",1983,"JP","Hatchback","FWD","I4",1983,1986,110],
["Honda","e",2020,"JP","Hatchback","RWD","Electric",2020,2024,154],
["Honda","CR-V (6th Gen)",2023,"JP","SUV","AWD","I4",2023,2025,190],
["Honda","Fit/Jazz RS (GK)",2014,"JP","Hatchback","FWD","I4",2014,2020,130],
["Honda","Element",2003,"JP","SUV","AWD","I4",2003,2011,166],
["Honda","Passport (3rd Gen)",2019,"JP","SUV","AWD","V6",2019,2025,280],
["Honda","Ridgeline",2017,"JP","Truck","AWD","V6",2017,2025,280],
["Honda","del Sol",1993,"JP","Roadster","FWD","I4",1992,1997,127],
// Mazda
["Mazda","RX-7 (FD3S)",1992,"JP","Coupe","RWD","Rotary",1992,2002,255],
["Mazda","RX-7 (FC3S)",1985,"JP","Coupe","RWD","Rotary",1985,1992,200],
["Mazda","RX-7 (SA22C)",1978,"JP","Coupe","RWD","Rotary",1978,1985,100],
["Mazda","RX-8",2003,"JP","Coupe","RWD","Rotary",2003,2012,232],
["Mazda","RX-3",1971,"JP","Coupe","RWD","Rotary",1971,1978,110],
["Mazda","MX-5 Miata (NA)",1989,"JP","Roadster","RWD","I4",1989,1997,116],
["Mazda","MX-5 Miata (NB)",1999,"JP","Roadster","RWD","I4",1999,2005,142],
["Mazda","MX-5 Miata (NC)",2006,"JP","Roadster","RWD","I4",2006,2015,170],
["Mazda","MX-5 Miata (ND)",2016,"JP","Roadster","RWD","I4",2016,2025,181],
["Mazda","Cosmo Sport 110S",1967,"JP","Coupe","RWD","Rotary",1967,1972,110],
["Mazda","Eunos Cosmo",1990,"JP","Coupe","RWD","Rotary",1990,1995,300],
["Mazda","Mazdaspeed3",2007,"JP","Hatchback","FWD","I4",2007,2013,263],
["Mazda","Mazdaspeed6",2005,"JP","Sedan","AWD","I4",2005,2007,274],
["Mazda","MX-30 EV",2021,"JP","SUV","FWD","Electric",2021,2025,145],
["Mazda","CX-50",2023,"JP","SUV","AWD","I4",2023,2025,227],
["Mazda","CX-5",2017,"JP","SUV","AWD","I4",2017,2025,187],
["Mazda","3 Turbo",2021,"JP","Hatchback","AWD","I4",2021,2025,250],
["Mazda","787B",1991,"JP","Coupe","RWD","Rotary",1991,1991,700],
// Subaru
["Subaru","Impreza WRX STI (GDB)",2004,"JP","Sedan","AWD","Flat-4",2001,2007,300],
["Subaru","WRX STI (VAB)",2015,"JP","Sedan","AWD","Flat-4",2015,2021,305],
["Subaru","WRX (VB)",2022,"JP","Sedan","AWD","Flat-4",2022,2025,271],
["Subaru","22B STI",1998,"JP","Coupe","AWD","Flat-4",1998,1998,280],
["Subaru","BRZ (2nd Gen)",2022,"JP","Coupe","RWD","Flat-4",2022,2025,228],
["Subaru","BRZ (1st Gen)",2013,"JP","Coupe","RWD","Flat-4",2013,2020,200],
["Subaru","SVX",1992,"JP","Coupe","AWD","Flat-6",1992,1997,230],
["Subaru","Legacy GT Wagon (BP5)",2005,"JP","Wagon","AWD","Flat-4",2005,2009,243],
["Subaru","Brat",1978,"JP","Truck","4WD","Flat-4",1978,1994,73],
["Subaru","Forester STI (SG9)",2005,"JP","SUV","AWD","Flat-4",2004,2008,265],
["Subaru","Solterra",2023,"JP","SUV","AWD","Electric",2023,2025,215],
["Subaru","Sambar",1990,"JP","Van","RWD","I4",1990,2012,46],
["Subaru","Outback (6th Gen)",2020,"JP","Wagon","AWD","Flat-4",2020,2025,182],
["Subaru","Crosstrek",2024,"JP","SUV","AWD","Flat-4",2024,2025,152],
// Mitsubishi
["Mitsubishi","Lancer Evolution VI",1999,"JP","Sedan","AWD","I4",1999,2001,276],
["Mitsubishi","Lancer Evolution IX",2005,"JP","Sedan","AWD","I4",2005,2007,286],
["Mitsubishi","Lancer Evolution X",2008,"JP","Sedan","AWD","I4",2008,2016,291],
["Mitsubishi","3000GT VR-4",1991,"JP","Coupe","AWD","V6",1991,1999,300],
["Mitsubishi","Eclipse GSX (2G)",1995,"JP","Coupe","AWD","I4",1995,1999,210],
["Mitsubishi","Starion",1982,"JP","Coupe","RWD","I4",1982,1989,188],
["Mitsubishi","FTO GPX",1994,"JP","Coupe","FWD","V6",1994,2000,200],
["Mitsubishi","Pajero Evolution",1997,"JP","SUV","4WD","V6",1997,1999,276],
["Mitsubishi","GTO",1990,"JP","Coupe","AWD","V6",1990,2000,300],
["Mitsubishi","Delica D:5",2007,"JP","Van","AWD","I4",2007,2025,90],
["Mitsubishi","Outlander PHEV",2022,"JP","SUV","AWD","I4",2022,2025,148],
// Datsun
["Datsun","240Z",1970,"JP","Coupe","RWD","I6",1970,1973,151],
["Datsun","280ZX Turbo",1981,"JP","Coupe","RWD","I6",1979,1983,180],
["Datsun","510",1968,"JP","Sedan","RWD","I4",1968,1973,96],
["Datsun","Fairlady 2000",1967,"JP","Roadster","RWD","I4",1967,1970,135],
["Datsun","260Z",1974,"JP","Coupe","RWD","I6",1974,1978,162],
// Suzuki
["Suzuki","Cappuccino",1991,"JP","Roadster","RWD","I3",1991,1997,64],
["Suzuki","Jimny (JB74)",2018,"JP","SUV","4WD","I4",2018,2025,102],
["Suzuki","Swift Sport (ZC33S)",2018,"JP","Hatchback","FWD","I4",2018,2025,140],
["Suzuki","Alto Works",1987,"JP","Hatchback","FWD","I3",1987,1994,64],
["Suzuki","Samurai",1985,"JP","SUV","4WD","I4",1985,1995,63],
["Suzuki","Vitara (1st Gen)",1989,"JP","SUV","4WD","I4",1989,1998,95],
// Lexus
["Lexus","LFA",2010,"JP","Coupe","RWD","V10",2010,2012,553],
["Lexus","LC 500",2017,"JP","Coupe","RWD","V8",2017,2025,471],
["Lexus","IS 300 (XE10)",2001,"JP","Sedan","RWD","I6",2001,2005,215],
["Lexus","IS-F",2008,"JP","Sedan","RWD","V8",2008,2014,416],
["Lexus","RC-F",2015,"JP","Coupe","RWD","V8",2015,2025,472],
["Lexus","LS 400 (XF10)",1990,"JP","Sedan","RWD","V8",1990,1994,250],
["Lexus","SC 400 (Z30)",1992,"JP","Coupe","RWD","V8",1992,2000,250],
["Lexus","GS-F",2016,"JP","Sedan","RWD","V8",2016,2020,467],
["Lexus","RZ 450e",2023,"JP","SUV","AWD","Electric",2023,2025,308],
["Lexus","GX 550",2024,"JP","SUV","4WD","V6",2024,2025,349],
["Lexus","LX 600",2022,"JP","SUV","4WD","V6",2022,2025,409],
// Other JDM
["Isuzu","VehiCROSS",1997,"JP","SUV","4WD","V6",1997,2001,215],
["Infiniti","G35 Coupe",2003,"JP","Coupe","RWD","V6",2003,2007,260],
["Infiniti","Q60 Red Sport",2017,"JP","Coupe","RWD","V6",2017,2022,400],
["Autozam","AZ-1",1992,"JP","Coupe","RWD","I3",1992,1994,64],
["Daihatsu","Copen",2002,"JP","Roadster","FWD","I4",2002,2012,64],
["Daihatsu","Charade GTti",1987,"JP","Hatchback","FWD","I3",1987,1993,100],

// ══════════════════════════════ GERMANY ══════════════════════════════
// Porsche
["Porsche","911 Carrera RS 2.7",1973,"DE","Coupe","RWD","Flat-6",1973,1973,210],
["Porsche","911 Turbo (930)",1975,"DE","Coupe","RWD","Flat-6",1975,1989,260],
["Porsche","911 GT3 (996)",1999,"DE","Coupe","RWD","Flat-6",1999,2004,360],
["Porsche","911 GT3 RS (991.2)",2016,"DE","Coupe","RWD","Flat-6",2016,2019,520],
["Porsche","911 GT3 (992)",2021,"DE","Coupe","RWD","Flat-6",2021,2025,502],
["Porsche","911 Turbo S (992)",2020,"DE","Coupe","AWD","Flat-6",2020,2025,640],
["Porsche","911 Carrera 4 (964)",1989,"DE","Coupe","AWD","Flat-6",1989,1994,250],
["Porsche","911 Turbo (993)",1995,"DE","Coupe","AWD","Flat-6",1995,1998,408],
["Porsche","911 Turbo (997)",2007,"DE","Coupe","AWD","Flat-6",2007,2012,480],
["Porsche","918 Spyder",2013,"DE","Roadster","AWD","V8",2013,2015,887],
["Porsche","944 Turbo",1986,"DE","Coupe","RWD","I4",1986,1991,247],
["Porsche","928 GTS",1992,"DE","Coupe","RWD","V8",1992,1995,345],
["Porsche","968 Club Sport",1993,"DE","Coupe","RWD","I4",1993,1995,240],
["Porsche","Cayman GT4 (981)",2015,"DE","Coupe","RWD","Flat-6",2015,2016,385],
["Porsche","Cayman GT4 RS (718)",2022,"DE","Coupe","RWD","Flat-6",2022,2025,493],
["Porsche","Boxster S (986)",2000,"DE","Roadster","RWD","Flat-6",2000,2004,252],
["Porsche","Cayenne Turbo GT",2022,"DE","SUV","AWD","V8",2022,2025,631],
["Porsche","Taycan Turbo S",2020,"DE","Sedan","AWD","Electric",2020,2025,750],
["Porsche","Macan EV",2024,"DE","SUV","AWD","Electric",2024,2025,402],
["Porsche","356 Speedster",1954,"DE","Roadster","RWD","Flat-4",1954,1958,70],
["Porsche","550 Spyder",1953,"DE","Roadster","RWD","Flat-4",1953,1956,110],
["Porsche","959",1986,"DE","Coupe","AWD","Flat-6",1986,1993,450],
["Porsche","Carrera GT",2004,"DE","Coupe","RWD","V10",2004,2007,612],
["Porsche","914",1970,"DE","Coupe","RWD","Flat-4",1970,1976,80],
["Porsche","Panamera Turbo S (971)",2017,"DE","Sedan","AWD","V8",2017,2023,620],
// BMW
["BMW","E30 M3",1986,"DE","Coupe","RWD","I4",1986,1991,192],
["BMW","E36 M3",1992,"DE","Coupe","RWD","I6",1992,1999,240],
["BMW","E46 M3",2000,"DE","Coupe","RWD","I6",2000,2006,333],
["BMW","E46 M3 CSL",2003,"DE","Coupe","RWD","I6",2003,2004,360],
["BMW","E92 M3 GTS",2010,"DE","Coupe","RWD","V8",2007,2013,450],
["BMW","F80 M3",2014,"DE","Sedan","RWD","I6",2014,2018,425],
["BMW","G80 M3 Competition",2021,"DE","Sedan","AWD","I6",2021,2025,503],
["BMW","M1",1978,"DE","Coupe","RWD","I6",1978,1981,273],
["BMW","2002 Turbo",1973,"DE","Coupe","RWD","I4",1973,1974,170],
["BMW","E39 M5",1998,"DE","Sedan","RWD","V8",1998,2003,400],
["BMW","E60 M5",2005,"DE","Sedan","RWD","V10",2005,2010,500],
["BMW","F90 M5 CS",2022,"DE","Sedan","AWD","V8",2022,2023,627],
["BMW","M2 (G87)",2023,"DE","Coupe","RWD","I6",2023,2025,453],
["BMW","Z3 M Coupe",1999,"DE","Coupe","RWD","I6",1998,2002,315],
["BMW","Z4 M Roadster (E85)",2006,"DE","Roadster","RWD","I6",2006,2008,330],
["BMW","Z8",2000,"DE","Roadster","RWD","V8",2000,2003,400],
["BMW","i8",2014,"DE","Coupe","AWD","I3",2014,2020,369],
["BMW","iX M60",2022,"DE","SUV","AWD","Electric",2022,2025,297],
["BMW","i4 M50",2022,"DE","Sedan","AWD","Electric",2022,2025,330],
["BMW","X5 M Competition (F95)",2020,"DE","SUV","AWD","V8",2020,2025,360],
["BMW","1M Coupe",2011,"DE","Coupe","RWD","I6",2011,2012,335],
["BMW","E28 M5",1985,"DE","Sedan","RWD","I6",1985,1988,282],
["BMW","507",1957,"DE","Roadster","RWD","V8",1957,1959,150],
["BMW","3.0 CSL",1972,"DE","Coupe","RWD","I6",1972,1975,206],
["BMW","3.0 CSL Hommage",2023,"DE","Coupe","RWD","I6",2023,2023,560],
["BMW","X3 M Competition (F97)",2020,"DE","SUV","AWD","I6",2020,2025,225],
["BMW","M240i (G42)",2022,"DE","Coupe","RWD","I6",2022,2025,382],
["BMW","M850i (G15)",2019,"DE","Coupe","AWD","V8",2019,2025,523],
["BMW","E34 M5",1989,"DE","Sedan","RWD","I6",1989,1995,311],
["BMW","Isetta",1955,"DE","Coupe","RWD","I4",1955,1962,13],
// Mercedes-Benz
["Mercedes-Benz","300SL Gullwing",1954,"DE","Coupe","RWD","I6",1954,1957,215],
["Mercedes-Benz","300SL Roadster",1957,"DE","Roadster","RWD","I6",1957,1963,215],
["Mercedes-Benz","190E 2.5-16 Evo II",1990,"DE","Sedan","RWD","I4",1990,1991,235],
["Mercedes-Benz","CLK GTR",1998,"DE","Coupe","RWD","V12",1998,1999,612],
["Mercedes-Benz","SLS AMG",2010,"DE","Coupe","RWD","V8",2010,2015,563],
["Mercedes-Benz","AMG GT R",2017,"DE","Coupe","RWD","V8",2017,2021,400],
["Mercedes-Benz","AMG GT Black Series",2021,"DE","Coupe","RWD","V8",2021,2022,720],
["Mercedes-Benz","AMG ONE",2023,"DE","Coupe","AWD","V6",2023,2025,1049],
["Mercedes-Benz","G63 AMG (W463A)",2019,"DE","SUV","AWD","V8",2019,2025,577],
["Mercedes-Benz","E63 AMG S Wagon (S213)",2021,"DE","Wagon","AWD","V8",2021,2024,603],
["Mercedes-Benz","C63 AMG (W204)",2008,"DE","Sedan","RWD","V8",2008,2014,451],
["Mercedes-Benz","C63 S E Performance (W206)",2023,"DE","Sedan","AWD","I4",2023,2025,671],
["Mercedes-AMG","Hammer",1986,"DE","Sedan","RWD","V8",1986,1991,360],
["Mercedes-Benz","SLR McLaren",2004,"DE","Coupe","RWD","V8",2004,2009,617],
["Mercedes-Benz","SL 500 (R129)",1990,"DE","Roadster","RWD","V8",1990,2002,315],
["Mercedes-Benz","EQS 580",2022,"DE","Sedan","AWD","Electric",2022,2025,516],
["Mercedes-Benz","W124 500E",1991,"DE","Sedan","RWD","V8",1991,1995,322],
["Mercedes-Benz","Unimog 404",1955,"DE","Truck","4WD","I4",1955,1980,110],
["Mercedes-Benz","SL 63 AMG (R232)",2022,"DE","Roadster","AWD","V8",2022,2025,577],
["Mercedes-Benz","GLE 63 S Coupe",2021,"DE","SUV","AWD","V8",2021,2025,603],
["Mercedes-Benz","A45 AMG S",2020,"DE","Hatchback","AWD","I4",2020,2025,416],
["Mercedes-Benz","EQE SUV",2023,"DE","SUV","AWD","Electric",2023,2025,402],
// Audi
["Audi","Quattro S1 E2",1985,"DE","Coupe","AWD","I5",1985,1986,470],
["Audi","Sport Quattro",1984,"DE","Coupe","AWD","I5",1984,1985,306],
["Audi","R8 V10 (Typ 42)",2009,"DE","Coupe","AWD","V10",2009,2015,525],
["Audi","R8 V10 Performance (Typ 4S)",2019,"DE","Coupe","AWD","V10",2019,2024,602],
["Audi","RS6 Avant (C8)",2020,"DE","Wagon","AWD","V8",2020,2025,591],
["Audi","RS4 Avant (B5)",2000,"DE","Wagon","AWD","V6",2000,2001,375],
["Audi","RS3 (8Y)",2022,"DE","Sedan","AWD","I5",2022,2025,401],
["Audi","TT RS (8S)",2017,"DE","Coupe","AWD","I5",2017,2023,394],
["Audi","S1",2015,"DE","Hatchback","AWD","I4",2015,2018,231],
["Audi","e-tron GT RS",2022,"DE","Sedan","AWD","Electric",2022,2025,637],
["Audi","Ur-Quattro",1980,"DE","Coupe","AWD","I5",1980,1991,200],
["Audi","RS7 Sportback (C8)",2020,"DE","Sedan","AWD","V8",2020,2025,591],
["Audi","RS5 (B9)",2018,"DE","Coupe","AWD","V6",2018,2025,444],
["Audi","S3 (8V)",2015,"DE","Sedan","AWD","I4",2015,2020,292],
["Audi","RS Q8",2020,"DE","SUV","AWD","V8",2020,2025,591],
["Audi","Q8 e-tron",2023,"DE","SUV","AWD","Electric",2023,2025,297],
// Volkswagen
["Volkswagen","Golf GTI Mk1",1976,"DE","Hatchback","FWD","I4",1976,1983,110],
["Volkswagen","Golf GTI Mk2",1984,"DE","Hatchback","FWD","I4",1984,1992,139],
["Volkswagen","Golf GTI Mk5",2005,"DE","Hatchback","FWD","I4",2005,2009,197],
["Volkswagen","Golf GTI Mk7",2014,"DE","Hatchback","FWD","I4",2014,2020,220],
["Volkswagen","Golf R (Mk8)",2022,"DE","Hatchback","AWD","I4",2022,2025,315],
["Volkswagen","Golf R32 (Mk5)",2006,"DE","Hatchback","AWD","V6",2006,2008,250],
["Volkswagen","Beetle (Type 1)",1938,"DE","Coupe","RWD","Flat-4",1938,2003,25],
["Volkswagen","Corrado VR6",1992,"DE","Coupe","FWD","V6",1988,1995,178],
["Volkswagen","Bus T1",1950,"DE","Van","RWD","Flat-4",1950,1967,30],
["Volkswagen","Bus T2",1967,"DE","Van","RWD","Flat-4",1967,1979,44],
["Volkswagen","Scirocco R (Mk3)",2010,"DE","Coupe","FWD","I4",2008,2017,265],
["Volkswagen","ID.4 GTX",2022,"DE","SUV","AWD","Electric",2022,2025,297],
["Volkswagen","Karmann Ghia",1955,"DE","Coupe","RWD","Flat-4",1955,1974,36],
["Volkswagen","Phaeton W12",2003,"DE","Sedan","AWD","W12",2003,2016,444],
["Volkswagen","Touareg V10 TDI",2003,"DE","SUV","AWD","V10",2003,2006,310],
["Volkswagen","ID. Buzz",2022,"DE","Van","AWD","Electric",2022,2025,282],
["Volkswagen","Jetta GLI (Mk7)",2019,"DE","Sedan","FWD","I4",2019,2025,228],
// Opel
["Opel","Speedster",2001,"DE","Roadster","RWD","I4",2001,2005,147],
["Opel","Manta GT/E",1975,"DE","Coupe","RWD","I4",1975,1988,105],
["Opel","Corsa OPC (E)",2015,"DE","Hatchback","FWD","I4",2015,2019,207],

// ══════════════════════════════ USA ══════════════════════════════
// Ford
["Ford","Mustang (1st Gen)",1964,"US","Coupe","RWD","V8",1964,1973,271],
["Ford","Mustang Boss 302 (1st Gen)",1970,"US","Coupe","RWD","V8",1969,1970,290],
["Ford","Mustang Fox Body",1987,"US","Coupe","RWD","V8",1979,1993,225],
["Ford","Mustang GT (SN95)",1994,"US","Coupe","RWD","V8",1994,2004,380],
["Ford","Mustang GT (S197)",2005,"US","Coupe","RWD","V8",2005,2014,400],
["Ford","Mustang GT (S550)",2015,"US","Coupe","RWD","V8",2015,2023,435],
["Ford","Mustang GT (S650)",2024,"US","Coupe","RWD","V8",2024,2025,480],
["Ford","Mustang Dark Horse (S650)",2024,"US","Coupe","RWD","V8",2024,2025,500],
["Ford","Mustang Mach-E GT",2021,"US","SUV","AWD","Electric",2021,2025,480],
["Ford","GT40 Mk I",1966,"US","Coupe","RWD","V8",1964,1969,485],
["Ford","GT (2005)",2005,"US","Coupe","RWD","V8",2005,2006,550],
["Ford","GT (2017)",2017,"US","Coupe","RWD","V6",2017,2022,647],
["Ford","Bronco (6th Gen)",2021,"US","SUV","4WD","V6",2021,2025,300],
["Ford","Bronco (1st Gen)",1966,"US","SUV","4WD","I6",1966,1977,170],
["Ford","F-150 Raptor (3rd Gen)",2021,"US","Truck","4WD","V6",2021,2025,450],
["Ford","F-150 Raptor R",2023,"US","Truck","4WD","V8",2023,2025,700],
["Ford","F-150 Lightning",2022,"US","Truck","4WD","Electric",2022,2025,580],
["Ford","RS200",1984,"UK","Coupe","AWD","I4",1984,1986,127],
["Ford","Crown Victoria (2nd Gen)",1998,"US","Sedan","RWD","V8",1998,2012,239],
["Ford","Focus RS (Mk3)",2016,"DE","Hatchback","AWD","I4",2016,2018,127],
["Ford","Focus ST (Mk3)",2013,"DE","Hatchback","FWD","I4",2013,2018,127],
["Ford","Fiesta ST (Mk7)",2014,"DE","Hatchback","FWD","I4",2014,2019,127],
["Ford","Thunderbird (1st Gen)",1955,"US","Coupe","RWD","V8",1955,1957,198],
["Ford","Escort RS Cosworth",1992,"UK","Coupe","AWD","I4",1992,1996,142],
["Ford","Maverick Hybrid",2022,"US","Truck","FWD","I4",2022,2025,191],
["Ford","Explorer ST (6th Gen)",2020,"US","SUV","AWD","V6",2020,2025,400],
["Ford","Ranger Raptor (Next Gen)",2023,"US","Truck","4WD","V6",2023,2025,405],
["Ford","F-100 (5th Gen)",1967,"US","Truck","RWD","V8",1967,1972,240],
["Ford","Galaxie 500",1963,"US","Coupe","RWD","V8",1962,1967,352],
["Ford","Pinto",1971,"US","Hatchback","RWD","I4",1971,1980,75],
// Chevrolet
["Chevrolet","Corvette C1",1953,"US","Roadster","RWD","I6",1953,1962,195],
["Chevrolet","Corvette C2 Stingray",1963,"US","Coupe","RWD","V8",1963,1967,360],
["Chevrolet","Corvette C3 Stingray",1968,"US","Coupe","RWD","V8",1968,1982,350],
["Chevrolet","Corvette C4 ZR-1",1990,"US","Coupe","RWD","V8",1990,1995,375],
["Chevrolet","Corvette C5 Z06",2001,"US","Coupe","RWD","V8",2001,2004,405],
["Chevrolet","Corvette C6 ZR1",2009,"US","Coupe","RWD","V8",2009,2013,638],
["Chevrolet","Corvette C7 Z06",2015,"US","Coupe","RWD","V8",2015,2019,650],
["Chevrolet","Corvette C8 Stingray",2020,"US","Coupe","RWD","V8",2020,2025,490],
["Chevrolet","Corvette C8 Z06",2023,"US","Coupe","RWD","V8",2023,2025,670],
["Chevrolet","Corvette C8 E-Ray",2024,"US","Coupe","AWD","V8",2024,2025,655],
["Chevrolet","Camaro SS (1st Gen)",1969,"US","Coupe","RWD","V8",1967,1969,350],
["Chevrolet","Camaro Z28 (2nd Gen)",1977,"US","Coupe","RWD","V8",1970,1981,245],
["Chevrolet","Camaro IROC-Z (3rd Gen)",1985,"US","Coupe","RWD","V8",1985,1990,245],
["Chevrolet","Camaro ZL1 1LE (6th Gen)",2018,"US","Coupe","RWD","V8",2017,2024,650],
["Chevrolet","Chevelle SS 454",1970,"US","Coupe","RWD","V8",1970,1972,450],
["Chevrolet","El Camino SS",1970,"US","Truck","RWD","V8",1968,1972,238],
["Chevrolet","Monte Carlo SS (1st Gen)",1970,"US","Coupe","RWD","V8",1970,1972,360],
["Chevrolet","Blazer K5",1972,"US","SUV","4WD","V8",1969,1994,250],
["Chevrolet","Impala SS (3rd Gen)",1964,"US","Sedan","RWD","V8",1964,1968,409],
["Chevrolet","Colorado ZR2 (3rd Gen)",2023,"US","Truck","4WD","I4",2023,2025,310],
["Chevrolet","Silverado EV RST",2024,"US","Truck","4WD","Electric",2024,2025,664],
["Chevrolet","Bolt EV",2017,"US","Hatchback","FWD","Electric",2017,2023,200],
["Chevrolet","Nova SS",1970,"US","Coupe","RWD","V8",1968,1972,350],
["Chevrolet","C10 Stepside",1967,"US","Truck","RWD","V8",1967,1972,250],
["Chevrolet","Suburban (12th Gen)",2021,"US","SUV","4WD","V8",2021,2025,396],
["Chevrolet","Tahoe Z71",2021,"US","SUV","4WD","V8",2021,2025,396],
["Chevrolet","Bel Air",1957,"US","Sedan","RWD","V8",1955,1957,283],
["Chevrolet","Trailblazer SS",2006,"US","SUV","AWD","V8",2006,2009,395],
// Dodge
["Dodge","Charger R/T (2nd Gen)",1969,"US","Coupe","RWD","V8",1968,1970,375],
["Dodge","Charger Daytona (2nd Gen)",1969,"US","Coupe","RWD","V8",1969,1969,425],
["Dodge","Charger Hellcat (LD)",2015,"US","Sedan","RWD","V8",2015,2023,707],
["Dodge","Challenger Hellcat (LA)",2015,"US","Coupe","RWD","V8",2015,2023,707],
["Dodge","Challenger Demon",2018,"US","Coupe","RWD","V8",2018,2018,808],
["Dodge","Challenger Demon 170",2023,"US","Coupe","RWD","V8",2023,2023,1025],
["Dodge","Viper GTS (SR II)",1996,"US","Coupe","RWD","V10",1996,2002,450],
["Dodge","Viper ACR (VX I)",2016,"US","Coupe","RWD","V10",2016,2017,645],
["Dodge","Ram SRT-10",2004,"US","Truck","RWD","V10",2004,2006,500],
["Dodge","Charger Daytona EV",2024,"US","Sedan","AWD","Electric",2024,2025,670],
["Dodge","Dart GTS (1st Gen)",1968,"US","Coupe","RWD","V8",1968,1969,280],
["Dodge","Durango SRT Hellcat",2021,"US","SUV","AWD","V8",2021,2022,710],
["Dodge","Neon SRT-4",2003,"US","Sedan","FWD","I4",2003,2005,230],
// Plymouth
["Plymouth","Barracuda (3rd Gen)",1970,"US","Coupe","RWD","V8",1970,1974,425],
["Plymouth","Superbird",1970,"US","Coupe","RWD","V8",1970,1970,425],
["Plymouth","Road Runner (1st Gen)",1968,"US","Coupe","RWD","V8",1968,1970,335],
["Plymouth","Duster 340",1970,"US","Coupe","RWD","V8",1970,1976,280],
["Plymouth","Prowler",1997,"US","Roadster","RWD","V6",1997,2002,253],
// Pontiac
["Pontiac","GTO (1964)",1964,"US","Coupe","RWD","V8",1964,1974,348],
["Pontiac","GTO Judge",1969,"US","Coupe","RWD","V8",1969,1971,366],
["Pontiac","Firebird Trans Am (2nd Gen)",1977,"US","Coupe","RWD","V8",1970,1981,220],
["Pontiac","Fiero GT",1985,"US","Coupe","RWD","V6",1985,1988,140],
["Pontiac","Solstice GXP",2007,"US","Roadster","RWD","I4",2006,2010,260],
["Pontiac","G8 GXP",2009,"US","Sedan","RWD","V8",2008,2009,415],
["Pontiac","Aztek",2001,"US","SUV","FWD","V6",2001,2005,185],
// Shelby
["Shelby","GT500 (1967)",1967,"US","Coupe","RWD","V8",1967,1970,355],
["Shelby","GT350 (1965)",1965,"US","Coupe","RWD","V8",1965,1970,306],
["Shelby","Cobra 427",1965,"US","Roadster","RWD","V8",1965,1967,485],
["Shelby","GT500 (S550)",2020,"US","Coupe","RWD","V8",2020,2022,760],
// Cadillac
["Cadillac","CT5-V Blackwing",2022,"US","Sedan","RWD","V8",2022,2025,668],
["Cadillac","CTS-V (3rd Gen)",2016,"US","Sedan","RWD","V8",2016,2019,640],
["Cadillac","Escalade-V",2023,"US","SUV","4WD","V8",2023,2025,682],
["Cadillac","ATS-V",2016,"US","Sedan","RWD","V6",2016,2019,464],
["Cadillac","Eldorado (1959)",1959,"US","Coupe","RWD","V8",1959,1960,345],
["Cadillac","LYRIQ",2023,"US","SUV","RWD","Electric",2023,2025,297],
["Cadillac","CT4-V Blackwing",2022,"US","Sedan","RWD","V6",2022,2025,472],
// Other US
["GMC","Syclone",1991,"US","Truck","AWD","V6",1991,1991,280],
["GMC","Typhoon",1992,"US","SUV","AWD","V6",1992,1993,280],
["GMC","Hummer EV",2022,"US","Truck","4WD","Electric",2022,2025,1000],
["Hummer","H1",1992,"US","SUV","4WD","V8",1992,2006,205],
["Hummer","H2",2003,"US","SUV","4WD","V8",2003,2009,325],
["GMC","Sierra Denali HD",2020,"US","Truck","4WD","V8",2020,2025,445],
["Jeep","Wrangler Rubicon (JL)",2018,"US","SUV","4WD","V6",2018,2025,285],
["Jeep","Grand Cherokee Trackhawk",2018,"US","SUV","AWD","V8",2018,2021,707],
["Jeep","CJ-7",1976,"US","SUV","4WD","I6",1976,1986,110],
["Jeep","Gladiator Rubicon",2020,"US","Truck","4WD","V6",2020,2025,285],
["Jeep","Cherokee XJ",1984,"US","SUV","4WD","I6",1984,2001,190],
["Jeep","Grand Wagoneer (WS)",2022,"US","SUV","4WD","V8",2022,2025,510],
["Buick","Grand National GNX",1987,"US","Coupe","RWD","V6",1987,1987,276],
["Buick","Regal GS (6th Gen)",2018,"US","Sedan","AWD","I4",2018,2020,310],
["Oldsmobile","442 W-30",1970,"US","Coupe","RWD","V8",1968,1972,370],
["AMC","Javelin AMX",1971,"US","Coupe","RWD","V8",1971,1974,360],
["AMC","Eagle",1980,"US","Wagon","4WD","I6",1980,1988,110],
["Saturn","Sky Red Line",2007,"US","Roadster","RWD","I4",2007,2010,260],
["Lincoln","Continental (4th Gen)",1961,"US","Sedan","RWD","V8",1961,1969,300],
["Lincoln","Navigator (4th Gen)",2018,"US","SUV","4WD","V6",2018,2025,450],
["DeSoto","Adventurer",1956,"US","Coupe","RWD","V8",1956,1960,345],
["Studebaker","Avanti",1963,"US","Coupe","RWD","V8",1963,1964,240],
["International","Scout 800",1965,"US","SUV","4WD","I4",1965,1971,111],
["International","Scout (2024 EV)",2024,"US","SUV","AWD","Electric",2024,2025,297],
// Tesla
["Tesla","Model S Plaid",2021,"US","Sedan","AWD","Electric",2021,2025,1020],
["Tesla","Model S (1st Gen)",2012,"US","Sedan","RWD","Electric",2012,2016,362],
["Tesla","Model 3 Performance",2018,"US","Sedan","AWD","Electric",2018,2025,510],
["Tesla","Model X Plaid",2022,"US","SUV","AWD","Electric",2022,2025,1020],
["Tesla","Model Y Performance",2022,"US","SUV","AWD","Electric",2022,2025,456],
["Tesla","Roadster (1st Gen)",2008,"US","Roadster","RWD","Electric",2008,2012,248],
["Tesla","Cybertruck",2024,"US","Truck","AWD","Electric",2024,2025,600],
// Rivian / Lucid / Other EV
["Rivian","R1T",2022,"US","Truck","AWD","Electric",2022,2025,835],
["Rivian","R1S",2022,"US","SUV","AWD","Electric",2022,2025,835],
["Lucid","Air Sapphire",2023,"US","Sedan","AWD","Electric",2023,2025,1234],
["Lucid","Air Grand Touring",2022,"US","Sedan","AWD","Electric",2022,2025,819],

// ══════════════════════════════ ITALY ══════════════════════════════
// Ferrari
["Ferrari","250 GTO",1962,"IT","Coupe","RWD","V12",1962,1964,300],
["Ferrari","F40",1987,"IT","Coupe","RWD","V8",1987,1992,478],
["Ferrari","F50",1995,"IT","Coupe","RWD","V12",1995,1997,513],
["Ferrari","Enzo",2002,"IT","Coupe","RWD","V12",2002,2004,651],
["Ferrari","LaFerrari",2013,"IT","Coupe","RWD","V12",2013,2018,950],
["Ferrari","SF90 Stradale",2020,"IT","Coupe","AWD","V8",2020,2025,986],
["Ferrari","288 GTO",1984,"IT","Coupe","RWD","V8",1984,1987,400],
["Ferrari","Testarossa",1984,"IT","Coupe","RWD","Flat-12",1984,1996,385],
["Ferrari","Dino 246 GT",1969,"IT","Coupe","RWD","V6",1969,1974,195],
["Ferrari","308 GTB",1975,"IT","Coupe","RWD","V8",1975,1985,255],
["Ferrari","328 GTS",1985,"IT","Coupe","RWD","V8",1985,1989,270],
["Ferrari","348 tb",1989,"IT","Coupe","RWD","V8",1989,1995,300],
["Ferrari","355 F1",1994,"IT","Coupe","RWD","V8",1994,1999,375],
["Ferrari","360 Modena",1999,"IT","Coupe","RWD","V8",1999,2005,400],
["Ferrari","430 Scuderia",2008,"IT","Coupe","RWD","V8",2004,2009,503],
["Ferrari","458 Italia",2010,"IT","Coupe","RWD","V8",2010,2015,562],
["Ferrari","488 Pista",2018,"IT","Coupe","RWD","V8",2015,2019,710],
["Ferrari","F8 Tributo",2019,"IT","Coupe","RWD","V8",2019,2022,710],
["Ferrari","296 GTB",2022,"IT","Coupe","RWD","V6",2022,2025,819],
["Ferrari","Roma",2020,"IT","Coupe","RWD","V8",2020,2025,612],
["Ferrari","812 Superfast",2017,"IT","Coupe","RWD","V12",2017,2021,789],
["Ferrari","Purosangue",2023,"IT","SUV","AWD","V12",2023,2025,715],
["Ferrari","Daytona SP3",2022,"IT","Roadster","RWD","V12",2022,2025,829],
["Ferrari","250 California",1957,"IT","Roadster","RWD","V12",1957,1963,240],
["Ferrari","275 GTB/4",1966,"IT","Coupe","RWD","V12",1966,1968,300],
["Ferrari","512 BB",1976,"IT","Coupe","RWD","Flat-12",1976,1984,360],
// Lamborghini
["Lamborghini","Miura P400",1966,"IT","Coupe","RWD","V12",1966,1973,350],
["Lamborghini","Countach LP400",1974,"IT","Coupe","RWD","V12",1974,1990,375],
["Lamborghini","Countach LP500 S",1982,"IT","Coupe","RWD","V12",1982,1985,449],
["Lamborghini","Diablo SV",1996,"IT","Coupe","RWD","V12",1996,1999,510],
["Lamborghini","Diablo GT",1999,"IT","Coupe","RWD","V12",1999,2001,575],
["Lamborghini","Murciélago LP640",2006,"IT","Coupe","AWD","V12",2001,2010,631],
["Lamborghini","Gallardo LP570-4 Superleggera",2011,"IT","Coupe","AWD","V10",2004,2013,562],
["Lamborghini","Huracán Performante",2017,"IT","Coupe","AWD","V10",2014,2025,631],
["Lamborghini","Huracán STO",2021,"IT","Coupe","RWD","V10",2021,2024,631],
["Lamborghini","Huracán Tecnica",2022,"IT","Coupe","RWD","V10",2022,2024,631],
["Lamborghini","Aventador SVJ",2019,"IT","Coupe","AWD","V12",2019,2022,759],
["Lamborghini","Aventador LP700-4",2011,"IT","Coupe","AWD","V12",2011,2022,691],
["Lamborghini","Revuelto",2024,"IT","Coupe","AWD","V12",2024,2025,1001],
["Lamborghini","Urus Performante",2023,"IT","SUV","AWD","V8",2023,2025,657],
["Lamborghini","Espada",1968,"IT","Coupe","RWD","V12",1968,1978,325],
["Lamborghini","Jalpa",1982,"IT","Coupe","RWD","V8",1982,1988,255],
["Lamborghini","350 GT",1964,"IT","Coupe","RWD","V12",1964,1966,270],
["Lamborghini","Temerario",2025,"IT","Coupe","AWD","V8",2025,2025,900],
// Maserati
["Maserati","MC20",2021,"IT","Coupe","RWD","V6",2021,2025,621],
["Maserati","GranTurismo (M145)",2007,"IT","Coupe","RWD","V8",2007,2019,405],
["Maserati","MC12",2004,"IT","Coupe","RWD","V12",2004,2005,630],
["Maserati","Ghibli (AM115)",1967,"IT","Coupe","RWD","V8",1967,1973,310],
["Maserati","Bora",1971,"IT","Coupe","RWD","V8",1971,1978,310],
["Maserati","Quattroporte V (M139)",2003,"IT","Sedan","RWD","V8",2003,2012,400],
["Maserati","GranCabrio Folgore",2024,"IT","Convertible","AWD","Electric",2024,2025,330],
["Maserati","Merak SS",1975,"IT","Coupe","RWD","V6",1975,1983,220],
// Alfa Romeo
["Alfa Romeo","33 Stradale",1967,"IT","Coupe","RWD","V8",1967,1969,280],
["Alfa Romeo","GTV6 (116)",1981,"IT","Coupe","RWD","V6",1981,1986,160],
["Alfa Romeo","4C",2013,"IT","Coupe","RWD","I4",2013,2020,237],
["Alfa Romeo","Giulia Quadrifoglio",2016,"IT","Sedan","RWD","V6",2016,2025,505],
["Alfa Romeo","8C Competizione",2007,"IT","Coupe","RWD","V8",2007,2010,450],
["Alfa Romeo","Montreal",1970,"IT","Coupe","RWD","V8",1970,1977,200],
["Alfa Romeo","Spider (Series 4)",1990,"IT","Roadster","RWD","I4",1990,1993,120],
["Alfa Romeo","156 GTA",2002,"IT","Sedan","FWD","V6",2002,2005,247],
["Alfa Romeo","Stelvio Quadrifoglio",2018,"IT","SUV","AWD","V6",2018,2025,505],
["Alfa Romeo","Tonale PHEV",2023,"IT","SUV","AWD","I4",2023,2025,148],
["Alfa Romeo","Junior Veloce",2024,"IT","SUV","FWD","Electric",2024,2025,297],
// Lancia
["Lancia","Delta Integrale",1987,"IT","Hatchback","AWD","I4",1987,1993,215],
["Lancia","Stratos",1973,"IT","Coupe","RWD","V6",1973,1978,190],
["Lancia","037 Rally",1982,"IT","Coupe","RWD","I4",1982,1983,205],
["Lancia","Fulvia Coupé",1965,"IT","Coupe","FWD","V4",1965,1976,115],
["Lancia","Thema 8.32",1986,"IT","Sedan","FWD","V8",1986,1992,215],
// Pagani
["Pagani","Zonda F",2005,"IT","Coupe","RWD","V12",2005,2006,602],
["Pagani","Huayra",2012,"IT","Coupe","RWD","V12",2012,2018,730],
["Pagani","Huayra BC",2017,"IT","Coupe","RWD","V12",2017,2020,789],
["Pagani","Utopia",2023,"IT","Coupe","RWD","V12",2023,2025,852],
// Other IT
["De Tomaso","Pantera",1971,"IT","Coupe","RWD","V8",1971,1993,350],
["De Tomaso","Mangusta",1967,"IT","Coupe","RWD","V8",1967,1971,305],
["Fiat","500 Abarth",2008,"IT","Hatchback","FWD","I4",2008,2019,160],
["Fiat","124 Spider Abarth",2016,"IT","Roadster","RWD","I4",2016,2020,164],
["Fiat","X1/9",1972,"IT","Coupe","RWD","I4",1972,1989,75],
["Fiat","Punto GT",1994,"IT","Hatchback","FWD","I4",1994,1999,133],
["Fiat","Panda 4x4 (141)",1983,"IT","Hatchback","4WD","I4",1983,2003,48],
["Fiat","500e",2021,"IT","Hatchback","FWD","Electric",2021,2025,280],
["Autobianchi","A112 Abarth",1971,"IT","Hatchback","FWD","I4",1971,1985,70],

// ══════════════════════════════ UK ══════════════════════════════
// McLaren
["McLaren","F1",1992,"UK","Coupe","RWD","V12",1992,1998,618],
["McLaren","P1",2013,"UK","Coupe","RWD","V8",2013,2015,903],
["McLaren","720S",2017,"UK","Coupe","RWD","V8",2017,2022,710],
["McLaren","Senna",2018,"UK","Coupe","RWD","V8",2018,2020,789],
["McLaren","765LT",2020,"UK","Coupe","RWD","V8",2020,2022,755],
["McLaren","600LT",2018,"UK","Coupe","RWD","V8",2018,2020,592],
["McLaren","Speedtail",2020,"UK","Coupe","RWD","V8",2020,2022,1036],
["McLaren","Elva",2021,"UK","Roadster","RWD","V8",2021,2022,804],
["McLaren","Artura",2022,"UK","Coupe","RWD","V6",2022,2025,671],
["McLaren","W1",2025,"UK","Coupe","RWD","V8",2025,2025,1258],
// Aston Martin
["Aston Martin","DB5",1963,"UK","Coupe","RWD","I6",1963,1965,282],
["Aston Martin","DB11",2016,"UK","Coupe","RWD","V12",2016,2025,600],
["Aston Martin","Vantage (2018)",2018,"UK","Coupe","RWD","V8",2018,2025,503],
["Aston Martin","Valkyrie",2022,"UK","Coupe","RWD","V12",2022,2025,1139],
["Aston Martin","DBS Superleggera",2018,"UK","Coupe","RWD","V12",2018,2023,715],
["Aston Martin","Vulcan",2015,"UK","Coupe","RWD","V12",2015,2016,820],
["Aston Martin","V8 Vantage (1977)",1977,"UK","Coupe","RWD","V8",1977,1989,375],
["Aston Martin","One-77",2010,"UK","Coupe","RWD","V12",2010,2012,750],
["Aston Martin","DBX707",2023,"UK","SUV","AWD","V8",2023,2025,697],
["Aston Martin","DB4 GT Zagato",1960,"UK","Coupe","RWD","I6",1960,1963,314],
// Jaguar
["Jaguar","E-Type (Series 1)",1961,"UK","Roadster","RWD","I6",1961,1968,265],
["Jaguar","XJ220",1992,"UK","Coupe","RWD","V6",1992,1994,542],
["Jaguar","F-Type R (X152)",2014,"UK","Coupe","RWD","V8",2014,2024,550],
["Jaguar","F-Type SVR",2017,"UK","Coupe","AWD","V8",2017,2020,400],
["Jaguar","XK120",1948,"UK","Roadster","RWD","I6",1948,1954,160],
["Jaguar","XJ-S V12",1975,"UK","Coupe","RWD","V12",1975,1996,295],
["Jaguar","XE SV Project 8",2017,"UK","Sedan","AWD","V8",2017,2019,592],
["Jaguar","I-PACE",2019,"UK","SUV","AWD","Electric",2019,2025,394],
["Jaguar","D-Type",1954,"UK","Roadster","RWD","I6",1954,1957,250],
["Jaguar","Mark 2",1959,"UK","Sedan","RWD","I6",1959,1967,220],
// Land Rover
["Land Rover","Defender 90 (L663)",2020,"UK","SUV","AWD","I6",2020,2025,395],
["Land Rover","Defender (Classic)",1983,"UK","SUV","4WD","I4",1948,2016,107],
["Land Rover","Range Rover Classic",1970,"UK","SUV","4WD","V8",1970,1996,182],
["Land Rover","Range Rover Sport SVR (L494)",2015,"UK","SUV","AWD","V8",2015,2022,575],
["Land Rover","Discovery (Series I)",1989,"UK","SUV","4WD","V8",1989,1998,182],
// Lotus
["Lotus","Elise S1",1996,"UK","Roadster","RWD","I4",1996,2000,118],
["Lotus","Exige V6 Cup",2012,"UK","Coupe","RWD","V6",2012,2021,345],
["Lotus","Esprit Turbo (S3)",1980,"UK","Coupe","RWD","I4",1980,2004,210],
["Lotus","Emira",2022,"UK","Coupe","RWD","V6",2022,2025,400],
["Lotus","Europa (Type 46)",1966,"UK","Coupe","RWD","I4",1966,1975,82],
["Lotus","Evija",2024,"UK","Coupe","AWD","Electric",2024,2025,1972],
["Lotus","Elan Sprint",1971,"UK","Roadster","RWD","I4",1962,1973,126],
["Lotus","Seven (Series 3)",1968,"UK","Roadster","RWD","I4",1957,1973,84],
// Other UK
["TVR","Sagaris",2004,"UK","Coupe","RWD","I6",2004,2006,406],
["TVR","Cerbera Speed 12",2000,"UK","Coupe","RWD","V12",2000,2000,800],
["TVR","Griffith (1992)",1992,"UK","Coupe","RWD","V8",1992,2002,340],
["Morgan","Plus Four",2020,"UK","Roadster","RWD","I4",2020,2025,255],
["Mini","Cooper S (Classic)",1963,"UK","Hatchback","FWD","I4",1963,2000,76],
["Mini","JCW GP (F56)",2020,"UK","Hatchback","FWD","I4",2020,2023,127],
["DeLorean","DMC-12",1981,"UK","Coupe","RWD","V6",1981,1983,130],
["Gordon Murray","T.50",2022,"UK","Coupe","RWD","V12",2022,2025,654],
["Gordon Murray","T.33",2024,"UK","Coupe","RWD","V12",2024,2025,607],
["Caterham","Seven 620R",2013,"UK","Roadster","RWD","I4",2013,2025,310],
["Ariel","Atom V8",2010,"UK","Roadster","RWD","V8",2010,2012,500],
["Ariel","Nomad",2015,"UK","Roadster","RWD","I4",2015,2025,150],
["Noble","M600",2010,"UK","Coupe","RWD","V8",2010,2018,650],
["Bentley","Continental GT Speed (3rd Gen)",2022,"UK","Coupe","AWD","W12",2018,2025,650],
["Bentley","Bentayga Speed",2020,"UK","SUV","AWD","W12",2020,2025,626],
["Rolls-Royce","Spectre",2024,"UK","Coupe","AWD","Electric",2024,2025,577],
["BAC","Mono",2011,"UK","Roadster","RWD","I4",2011,2025,305],
["Triumph","TR6",1969,"UK","Roadster","RWD","I6",1969,1976,150],
["MG","MGB GT",1965,"UK","Coupe","RWD","I4",1965,1980,95],
["Austin-Healey","3000 Mk III",1959,"UK","Roadster","RWD","I6",1959,1967,150],
["MG","Cyberster",2024,"UK","Roadster","RWD","Electric",2024,2025,330],

// ══════════════════════════════ FRANCE ══════════════════════════════
["Alpine","A110 (2018)",2018,"FR","Coupe","RWD","I4",2018,2025,252],
["Alpine","A110 (1973)",1973,"FR","Coupe","RWD","I4",1961,1977,138],
["Alpine","A310",1971,"FR","Coupe","RWD","I4",1971,1984,150],
["Alpine","A290",2025,"FR","Hatchback","FWD","Electric",2025,2025,280],
["Bugatti","Veyron",2005,"FR","Coupe","AWD","W16",2005,2015,1001],
["Bugatti","Chiron",2016,"FR","Coupe","AWD","W16",2016,2022,1500],
["Bugatti","Chiron Super Sport",2022,"FR","Coupe","AWD","W16",2022,2023,1578],
["Bugatti","EB110",1991,"FR","Coupe","AWD","V12",1991,1995,553],
["Bugatti","Divo",2019,"FR","Coupe","AWD","W16",2019,2020,1500],
["Bugatti","Type 35",1924,"FR","Roadster","RWD","I8",1924,1930,140],
["Bugatti","Tourbillon",2024,"FR","Coupe","AWD","V16",2024,2025,1775],
["Peugeot","205 GTI",1984,"FR","Hatchback","FWD","I4",1984,1994,130],
["Peugeot","306 Rallye",1994,"FR","Hatchback","FWD","I4",1994,2002,167],
["Peugeot","405 Mi16",1988,"FR","Sedan","FWD","I4",1988,1997,160],
["Peugeot","508 PSE",2021,"FR","Sedan","AWD","I4",2021,2024,360],
["Peugeot","206 RC",2003,"FR","Hatchback","FWD","I4",2003,2006,177],
["Renault","Clio V6 (Phase 2)",2001,"FR","Hatchback","RWD","V6",2001,2005,255],
["Renault","5 Turbo",1980,"FR","Hatchback","RWD","I4",1980,1986,160],
["Renault","Mégane RS Trophy-R",2019,"FR","Hatchback","FWD","I4",2019,2023,296],
["Renault","Sport Spider",1996,"FR","Roadster","RWD","I4",1996,1999,148],
["Renault","5 E-Tech",2025,"FR","Hatchback","FWD","Electric",2025,2025,280],
["Citroën","DS (ID 19)",1955,"FR","Sedan","FWD","I4",1955,1975,75],
["Citroën","SM",1970,"FR","Coupe","FWD","V6",1970,1975,170],
["Citroën","2CV",1948,"FR","Sedan","FWD","Flat-4",1948,1990,29],
["Citroën","AX GT",1987,"FR","Hatchback","FWD","I4",1987,1998,85],
["Venturi","400 GT",1994,"FR","Coupe","RWD","V6",1994,1999,408],

// ══════════════════════════════ SWEDEN ══════════════════════════════
["Volvo","240 Turbo",1983,"SE","Sedan","RWD","I4",1983,1993,155],
["Volvo","P1800",1961,"SE","Coupe","RWD","I4",1961,1973,108],
["Volvo","C30 Polestar",2013,"SE","Hatchback","FWD","I5",2013,2013,227],
["Volvo","V60 Polestar",2015,"SE","Wagon","AWD","I6",2015,2018,362],
["Volvo","850 T5-R",1995,"SE","Wagon","FWD","I5",1995,1997,240],
["Volvo","Amazon 122S",1958,"SE","Sedan","RWD","I4",1958,1970,96],
["Volvo","XC90 Recharge",2022,"SE","SUV","AWD","I4",2022,2025,148],
["Volvo","EX90",2024,"SE","SUV","AWD","Electric",2024,2025,297],
["Koenigsegg","Agera RS",2015,"SE","Coupe","RWD","V8",2015,2018,1160],
["Koenigsegg","Jesko",2022,"SE","Coupe","RWD","V8",2022,2025,1600],
["Koenigsegg","Regera",2016,"SE","Coupe","RWD","V8",2016,2021,1500],
["Koenigsegg","CCX",2006,"SE","Coupe","RWD","V8",2006,2010,806],
["Koenigsegg","Gemera",2024,"SE","Coupe","AWD","I3",2024,2025,1700],
["Polestar","1",2020,"SE","Coupe","AWD","I4",2020,2021,619],
["Polestar","2",2021,"SE","Sedan","AWD","Electric",2021,2025,408],
["Polestar","3",2024,"SE","SUV","AWD","Electric",2024,2025,297],
["Saab","900 Turbo",1979,"SE","Coupe","FWD","I4",1979,1993,145],
["Saab","9-3 Viggen",1999,"SE","Coupe","FWD","I4",1999,2002,230],
["Saab","96 (V4)",1967,"SE","Sedan","FWD","V4",1960,1980,65],
["Saab","Sonett III",1970,"SE","Coupe","FWD","V4",1970,1974,65],

// ══════════════════════════════ SOUTH KOREA ══════════════════════════════
["Hyundai","Veloster N",2019,"KR","Hatchback","FWD","I4",2019,2023,275],
["Hyundai","Ioniq 5 N",2024,"KR","SUV","AWD","Electric",2024,2025,641],
["Hyundai","Ioniq 6",2023,"KR","Sedan","AWD","Electric",2023,2025,330],
["Hyundai","i30 N (PD)",2018,"KR","Hatchback","FWD","I4",2018,2023,275],
["Hyundai","Kona N",2022,"KR","SUV","FWD","I4",2022,2023,276],
["Hyundai","Elantra N (CN7)",2022,"KR","Sedan","FWD","I4",2022,2025,276],
["Hyundai","Tucson Hybrid (NX4)",2022,"KR","SUV","AWD","I4",2022,2025,226],
["Hyundai","Santa Cruz",2022,"KR","Truck","AWD","I4",2022,2025,281],
["Genesis","G70 (IK)",2018,"KR","Sedan","RWD","V6",2018,2025,365],
["Genesis","GV60 Performance",2023,"KR","SUV","AWD","Electric",2023,2025,429],
["Genesis","GV80 Coupe",2025,"KR","SUV","AWD","V6",2025,2025,277],
["Genesis","G80 EV",2022,"KR","Sedan","AWD","Electric",2022,2025,365],
["Genesis","GV70",2022,"KR","SUV","AWD","I4",2022,2025,300],
["Kia","Stinger GT",2018,"KR","Sedan","RWD","V6",2018,2023,365],
["Kia","EV6 GT",2023,"KR","SUV","AWD","Electric",2023,2025,577],
["Kia","Seltos",2020,"KR","SUV","FWD","I4",2020,2025,146],
["Kia","Telluride",2020,"KR","SUV","AWD","V6",2020,2025,291],
["Kia","EV9",2024,"KR","SUV","AWD","Electric",2024,2025,379],
["SsangYong","Korando (C300)",2019,"KR","SUV","AWD","I4",2019,2025,163],

// ══════════════════════════════ REST OF WORLD ══════════════════════════════
// Croatia
["Rimac","Nevera",2022,"HR","Coupe","AWD","Electric",2022,2025,1914],
["Rimac","Concept_One",2013,"HR","Coupe","AWD","Electric",2013,2014,1224],
// Czech Republic
["Škoda","Octavia RS (Mk1)",2001,"CZ","Sedan","FWD","I4",2001,2004,180],
["Škoda","Fabia RS (6Y)",2003,"CZ","Hatchback","FWD","I4",2003,2007,130],
// Spain
["SEAT","León Cupra R (Mk3)",2018,"ES","Hatchback","FWD","I4",2018,2020,296],
["SEAT","Ibiza Cupra (6L)",2004,"ES","Hatchback","FWD","I4",2004,2008,180],
["Cupra","Born",2022,"ES","Hatchback","RWD","Electric",2022,2025,231],
["Cupra","Formentor VZ5",2021,"ES","SUV","AWD","I5",2021,2025,385],
// Netherlands
["Donkervoort","D8 GTO-JD70",2020,"NL","Roadster","RWD","I5",2020,2025,415],
["Spyker","C8 Aileron",2009,"NL","Coupe","RWD","V8",2009,2014,400],
// Austria
["KTM","X-Bow GT-XR",2023,"AT","Coupe","RWD","I4",2023,2025,300],
// Romania
["Dacia","Duster (HM)",2018,"RO","SUV","4WD","I4",2018,2025,130],
// India
["Tata","Nano",2008,"IN","Hatchback","RWD","I4",2008,2018,38],
["Mahindra","Thar (AX)",2020,"IN","SUV","4WD","I4",2020,2025,150],
// Australia
["Holden","Commodore V8 (VE SS)",2006,"AU","Sedan","RWD","V8",2006,2013,362],
["Holden","Monaro CV8 (V2)",2001,"AU","Coupe","RWD","V8",2001,2005,320],
["HSV","Maloo R8 (E3)",2007,"AU","Truck","RWD","V8",2007,2017,425],
["Ford","Falcon GT-HO Phase III (XY)",1971,"AU","Sedan","RWD","V8",1971,1972,351],
// Malaysia
["Proton","Satria GTi",2000,"MY","Hatchback","FWD","I4",2000,2005,138],
// China
["BYD","Seal",2023,"CN","Sedan","AWD","Electric",2023,2025,390],
["NIO","ET7",2022,"CN","Sedan","AWD","Electric",2022,2025,644],
["Zeekr","001",2021,"CN","Hatchback","AWD","Electric",2021,2025,280],
["Geely","Coolray",2019,"CN","SUV","FWD","I3",2019,2025,72],
["XPeng","P7",2020,"CN","Sedan","RWD","Electric",2020,2025,300],
["BYD","Atto 3",2022,"CN","SUV","FWD","Electric",2022,2025,297],
["Xiaomi","SU7",2024,"CN","Sedan","RWD","Electric",2024,2025,295],
// UAE
["W Motors","Lykan HyperSport",2013,"AE","Coupe","RWD","Flat-6",2013,2017,770],
// USA Specialty
["Hennessey","Venom GT",2013,"US","Coupe","RWD","V8",2013,2017,1244],
["Hennessey","Venom F5",2021,"US","Coupe","RWD","V8",2021,2025,1817],
["SSC","Tuatara",2020,"US","Coupe","RWD","V8",2020,2025,1750],
["Saleen","S7 Twin Turbo",2000,"US","Coupe","RWD","V8",2000,2009,750],
["Panoz","Esperante",2000,"US","Coupe","RWD","V8",2000,2006,305],
["Vector","W8",1990,"US","Coupe","RWD","V8",1990,1993,625],
["Rezvani","Beast Alpha",2017,"US","Coupe","RWD","I4",2017,2020,500],
["DeLorean","Alpha5",2024,"US","Coupe","AWD","Electric",2024,2025,330],
["Fisker","Karma",2012,"US","Sedan","RWD","I4",2012,2012,403],
["Czinger","21C",2023,"US","Coupe","RWD","V8",2023,2025,1233],
["Bollinger","B1",2023,"US","SUV","4WD","Electric",2023,2025,297],
["Karma","GS-6",2021,"US","Sedan","RWD","I4",2021,2023,536],
["Polaris","Slingshot",2015,"US","Roadster","RWD","I4",2015,2025,203],
["Local Motors","Rally Fighter",2010,"US","SUV","RWD","V8",2010,2016,430],
// ══════════ EXPANSION: Additional models ══════════
["Toyota","Altezza RS200",1998,"JP","Sedan","RWD","I4",1998,2005,142],
["Toyota","Aristo (S160)",1997,"JP","Sedan","RWD","I6",1997,2004,237],
["Toyota","Caldina GT-T",1997,"JP","Wagon","AWD","I4",1997,2002,142],
["Toyota","Verossa VR25",2001,"JP","Sedan","RWD","I6",2001,2004,237],
["Toyota","MR-S / MR2 Spyder",1999,"JP","Roadster","RWD","I4",1999,2007,142],
["Toyota","iQ",2008,"JP","Hatchback","FWD","I4",2008,2015,94],
["Toyota","Crown Majesta (S180)",2004,"JP","Sedan","RWD","V8",2004,2009,280],
["Toyota","Harrier (XU60)",2020,"JP","SUV","AWD","I4",2020,2025,218],
["Toyota","86 (ZN6)",2012,"JP","Coupe","RWD","Flat-4",2012,2020,200],
["Toyota","Yaris GR Sport",2022,"JP","Hatchback","FWD","I4",2022,2025,120],
["Toyota","Sequoia TRD Pro (3rd Gen)",2023,"JP","SUV","4WD","V6",2023,2025,437],
["Toyota","Tundra (2nd Gen)",2007,"JP","Truck","4WD","V8",2007,2021,381],
["Toyota","Scion tC",2005,"JP","Coupe","FWD","I4",2005,2016,161],
["Toyota","Scion xB (1st Gen)",2004,"JP","Hatchback","FWD","I4",2004,2006,108],
["Toyota","Venza (2nd Gen)",2021,"JP","SUV","AWD","I4",2021,2025,219],
["Nissan","Juke NISMO RS",2014,"JP","SUV","FWD","I4",2014,2018,135],
["Nissan","Note e-Power NISMO",2017,"JP","Hatchback","FWD","I3",2017,2020,68],
["Nissan","Cube",2009,"JP","Hatchback","FWD","I4",2009,2014,127],
["Nissan","Kicks",2021,"JP","SUV","FWD","I4",2021,2025,148],
["Nissan","Murano (Z52)",2015,"JP","SUV","AWD","V6",2015,2024,252],
["Nissan","Xterra (N50)",2005,"JP","SUV","4WD","V6",2005,2015,252],
["Nissan","Titan PRO-4X",2017,"JP","Truck","4WD","V8",2017,2025,340],
["Nissan","Maxima (A36)",2016,"JP","Sedan","FWD","V6",2016,2023,280],
["Nissan","Altima SR",2019,"JP","Sedan","FWD","I4",2019,2025,150],
["Nissan","Rogue (T33)",2021,"JP","SUV","AWD","I4",2021,2025,148],
["Honda","Civic Si (FG2)",2006,"JP","Coupe","FWD","I4",2006,2011,197],
["Honda","Civic Si (FC1)",2017,"JP","Sedan","FWD","I4",2017,2021,205],
["Honda","HR-V",2023,"JP","SUV","AWD","I4",2023,2025,158],
["Honda","Pilot TrailSport",2023,"JP","SUV","AWD","V6",2023,2025,285],
["Honda","Clarity PHEV",2018,"JP","Sedan","FWD","I4",2018,2021,212],
["Honda","Accord Type R (CH1)",1998,"JP","Sedan","FWD","I4",1998,2002,212],
["Honda","Odyssey (5th Gen)",2018,"JP","Minivan","FWD","V6",2018,2025,280],
["Honda","N-One RS",2020,"JP","Hatchback","FWD","I3",2020,2025,64],
["Honda","Legend (KB1)",2004,"JP","Sedan","AWD","V6",2004,2012,300],
["Mazda","CX-90 PHEV",2024,"JP","SUV","AWD","I4",2024,2025,323],
["Mazda","6 (GJ) Turbo",2018,"JP","Sedan","FWD","I4",2018,2023,227],
["Mazda","CX-60",2022,"JP","SUV","AWD","I6",2022,2025,254],
["Mazda","2",2020,"JP","Hatchback","FWD","I4",2020,2025,111],
["Mazda","BT-50 Thunder",2020,"JP","Truck","4WD","I4",2020,2025,190],
["Subaru","Levorg STI Sport",2020,"JP","Wagon","AWD","Flat-4",2020,2025,177],
["Subaru","WRX STI S209",2019,"JP","Sedan","AWD","Flat-4",2019,2019,341],
["Subaru","Ascent",2019,"JP","SUV","AWD","Flat-4",2019,2025,260],
["Subaru","Legacy 3.6R",2015,"JP","Sedan","AWD","Flat-6",2015,2019,256],
["Mitsubishi","Outlander PHEV (GN)",2022,"JP","SUV","AWD","I4",2022,2025,148],
["Mitsubishi","Triton / L200",2019,"JP","Truck","4WD","I4",2019,2025,127],
["Mitsubishi","Eclipse Cross",2018,"JP","SUV","AWD","I4",2018,2025,135],
["Mitsubishi","Sigma / Diamante",1991,"JP","Sedan","FWD","V6",1991,2005,266],
["Suzuki","Ignis Sport",2003,"JP","Hatchback","FWD","I4",2003,2008,120],
["Suzuki","Vitara Brezza",2020,"JP","SUV","FWD","I4",2020,2025,135],
["Suzuki","Grand Vitara (3rd Gen)",2005,"JP","SUV","4WD","V6",2005,2015,252],
["Suzuki","Carry Truck",1999,"JP","Truck","RWD","I3",1999,2013,64],
["Datsun","620 Pickup",1972,"JP","Truck","RWD","I4",1972,1979,89],
["Lexus","NX 350h",2022,"JP","SUV","AWD","I4",2022,2025,239],
["Lexus","ES 350 (XV70)",2019,"JP","Sedan","FWD","V6",2019,2025,302],
["Lexus","RX 500h F Sport",2023,"JP","SUV","AWD","I4",2023,2025,367],
["Lexus","UX 300e",2021,"JP","SUV","FWD","Electric",2021,2025,297],
["Lexus","TX 550h+",2024,"JP","SUV","AWD","I4",2024,2025,406],
["Lexus","IS 500 F Sport Performance",2022,"JP","Sedan","RWD","V8",2022,2025,472],
["Infiniti","Q50 Red Sport 400",2016,"JP","Sedan","RWD","V6",2016,2025,400],
["Infiniti","FX50",2009,"JP","SUV","AWD","V8",2009,2013,390],
["Infiniti","QX80",2018,"JP","SUV","4WD","V8",2018,2025,360],
["Acura","Integra (2023)",2023,"JP","Hatchback","FWD","I4",2023,2025,200],
["Acura","TLX Type S",2021,"JP","Sedan","AWD","V6",2021,2025,355],
["Acura","MDX Type S",2022,"JP","SUV","AWD","V6",2022,2025,355],
["Acura","RSX Type S",2002,"JP","Coupe","FWD","I4",2002,2006,201],
["Acura","Legend (KA7)",1991,"JP","Sedan","FWD","V6",1991,1995,200],
["Acura","NSX-T",1995,"JP","Coupe","RWD","V6",1995,2005,270],
["Porsche","Macan GTS (95B)",2020,"DE","SUV","AWD","V6",2020,2024,375],
["Porsche","Panamera GTS (971)",2019,"DE","Sedan","AWD","V8",2019,2023,473],
["Porsche","911 Sport Classic (992)",2022,"DE","Coupe","RWD","Flat-6",2022,2023,543],
["Porsche","Cayenne GTS (E3)",2020,"DE","SUV","AWD","V8",2020,2024,360],
["Porsche","Boxster Spyder (981)",2016,"DE","Roadster","RWD","Flat-6",2016,2016,350],
["BMW","X6 M Competition (F96)",2020,"DE","SUV","AWD","V8",2020,2025,360],
["BMW","M340i (G20)",2019,"DE","Sedan","AWD","I6",2019,2025,382],
["BMW","M135i (F40)",2020,"DE","Hatchback","AWD","I4",2020,2025,302],
["BMW","X1 (U11)",2023,"DE","SUV","AWD","I4",2023,2025,148],
["BMW","iX xDrive50",2022,"DE","SUV","AWD","Electric",2022,2025,297],
["BMW","2002 (E10)",1968,"DE","Coupe","RWD","I4",1968,1976,105],
["BMW","E21 323i",1978,"DE","Coupe","RWD","I6",1978,1983,143],
["BMW","Z1",1989,"DE","Roadster","RWD","I6",1989,1991,170],
["BMW","M8 Competition (F92)",2020,"DE","Coupe","AWD","V8",2020,2025,617],
["Mercedes-Benz","CLA 45 AMG S (C118)",2020,"DE","Sedan","AWD","I4",2020,2025,150],
["Mercedes-Benz","GLC 63 AMG S (X254)",2023,"DE","SUV","AWD","I4",2023,2025,671],
["Mercedes-Benz","S-Class (W223)",2021,"DE","Sedan","AWD","I6",2021,2025,496],
["Mercedes-Benz","AMG GT 63 S (X290)",2019,"DE","Sedan","AWD","V8",2019,2024,630],
["Mercedes-Benz","Maybach S 680",2022,"DE","Sedan","AWD","V12",2022,2025,621],
["Mercedes-Benz","GLA 35 AMG",2021,"DE","SUV","AWD","I4",2021,2025,148],
["Mercedes-Benz","EQB 350",2022,"DE","SUV","AWD","Electric",2022,2025,288],
["Mercedes-Benz","230SL Pagoda",1963,"DE","Roadster","RWD","I6",1963,1967,150],
["Audi","A1 Sportback",2019,"DE","Hatchback","FWD","I4",2019,2025,116],
["Audi","SQ5 (FY)",2018,"DE","SUV","AWD","V6",2018,2025,349],
["Audi","SQ7 (4M)",2020,"DE","SUV","AWD","V8",2020,2025,500],
["Audi","A5 Sportback (F5)",2017,"DE","Sedan","AWD","I4",2017,2025,261],
["Audi","Q4 e-tron",2022,"DE","SUV","AWD","Electric",2022,2025,297],
["Volkswagen","Arteon R",2021,"DE","Sedan","AWD","I4",2021,2025,315],
["Volkswagen","Tiguan R",2021,"DE","SUV","AWD","I4",2021,2025,315],
["Volkswagen","T-Roc R",2020,"DE","SUV","AWD","I4",2020,2025,296],
["Volkswagen","Amarok (2H)",2023,"DE","Truck","4WD","V6",2023,2025,241],
["Volkswagen","Up! GTI",2018,"DE","Hatchback","FWD","I3",2018,2023,115],
["Volkswagen","Golf GTI Mk4",1998,"DE","Hatchback","FWD","I4",1998,2004,180],
["Volkswagen","Polo GTI (AW)",2018,"DE","Hatchback","FWD","I4",2018,2025,207],
["Opel","Astra OPC (J)",2012,"DE","Hatchback","FWD","I4",2012,2015,276],
["Smart","Brabus (453)",2016,"DE","Hatchback","RWD","I3",2016,2019,107],
["Ford","Mustang Mach 1 (S550)",2021,"US","Coupe","RWD","V8",2021,2023,480],
["Ford","Taurus SHO (6th Gen)",2010,"US","Sedan","AWD","V6",2010,2019,365],
["Ford","Flex EcoBoost",2009,"US","SUV","AWD","V6",2009,2019,365],
["Ford","Edge ST",2019,"US","SUV","AWD","V6",2019,2024,335],
["Ford","Expedition (4th Gen)",2018,"US","SUV","4WD","V6",2018,2025,400],
["Ford","Super Duty F-250 Tremor",2020,"US","Truck","4WD","V8",2020,2025,475],
["Ford","Torino GT",1968,"US","Coupe","RWD","V8",1968,1971,280],
["Ford","Fairlane 500",1957,"US","Sedan","RWD","V8",1957,1961,245],
["Ford","Model T",1908,"US","Sedan","RWD","I4",1908,1927,20],
["Chevrolet","Equinox EV",2024,"US","SUV","FWD","Electric",2024,2025,297],
["Chevrolet","Traverse RS",2018,"US","SUV","AWD","V6",2018,2025,310],
["Chevrolet","Malibu (10th Gen)",2016,"US","Sedan","FWD","I4",2016,2024,160],
["Chevrolet","Spark",2013,"US","Hatchback","FWD","I4",2013,2022,98],
["Chevrolet","Equinox RS (3rd Gen)",2018,"US","SUV","AWD","I4",2018,2025,135],
["Chevrolet","Cruze RS",2016,"US","Sedan","FWD","I4",2016,2019,153],
["Chevrolet","SSR",2003,"US","Truck","RWD","V8",2003,2006,390],
["Chevrolet","Avalanche",2002,"US","Truck","4WD","V8",2002,2013,323],
["Chevrolet","S-10 Blazer",1983,"US","SUV","4WD","V6",1983,2005,214],
["Chevrolet","Sonic RS",2013,"US","Hatchback","FWD","I4",2013,2020,138],
["Dodge","Stealth R/T Turbo",1991,"US","Coupe","AWD","V6",1991,1996,300],
["Dodge","Hornet R/T",2023,"US","SUV","AWD","I4",2023,2025,288],
["Dodge","Nitro",2007,"US","SUV","4WD","V6",2007,2012,210],
["Dodge","Magnum SRT-8",2006,"US","Wagon","RWD","V8",2006,2008,425],
["Dodge","Shadow Turbo",1989,"US","Hatchback","FWD","I4",1987,1994,146],
["Chrysler","300 SRT8",2006,"US","Sedan","RWD","V8",2006,2014,470],
["Chrysler","Crossfire SRT-6",2005,"US","Coupe","RWD","V6",2005,2008,330],
["Chrysler","PT Cruiser GT",2003,"US","Hatchback","FWD","I4",2003,2010,230],
["Chrysler","Pacifica Hybrid",2017,"US","Minivan","FWD","V6",2017,2025,260],
["Pontiac","Grand Prix GXP",2005,"US","Sedan","FWD","V8",2005,2008,303],
["Pontiac","Bonneville GXP",2004,"US","Sedan","FWD","V8",2004,2005,380],
["Pontiac","Grand Am GT",1999,"US","Coupe","FWD","V6",1999,2005,175],
["Buick","Riviera (8th Gen)",1995,"US","Coupe","FWD","V6",1995,1999,205],
["Buick","Enclave Avenir",2022,"US","SUV","AWD","V6",2022,2025,310],
["Cadillac","XLR-V",2006,"US","Roadster","RWD","V8",2006,2009,443],
["Cadillac","STS-V",2006,"US","Sedan","RWD","V8",2006,2009,469],
["Cadillac","Celestiq",2024,"US","Sedan","AWD","Electric",2024,2025,600],
["Lincoln","Aviator Grand Touring",2020,"US","SUV","AWD","V6",2020,2025,494],
["Lincoln","Continental (10th Gen)",2017,"US","Sedan","AWD","V6",2017,2020,400],
["Lincoln","Mark VIII",1993,"US","Coupe","RWD","V8",1993,1998,280],
["Jeep","Wagoneer S EV",2024,"US","SUV","AWD","Electric",2024,2025,297],
["Jeep","Compass Trailhawk",2017,"US","SUV","4WD","I4",2017,2025,200],
["Jeep","Renegade Trailhawk",2015,"US","SUV","4WD","I4",2015,2023,180],
["GMC","Canyon AT4X",2023,"US","Truck","4WD","I4",2023,2025,310],
["GMC","Yukon Denali",2021,"US","SUV","4WD","V8",2021,2025,420],
["GMC","Sierra 1500 AT4",2019,"US","Truck","4WD","V8",2019,2025,420],
["Ram","1500 TRX",2021,"US","Truck","4WD","V8",2021,2024,702],
["Ram","2500 Power Wagon",2019,"US","Truck","4WD","V8",2019,2025,410],
["Ram","1500 REV",2025,"US","Truck","4WD","Electric",2025,2025,280],
["Tesla","Model 3 (Highland)",2024,"US","Sedan","AWD","Electric",2024,2025,330],
["Fisker","Ocean",2023,"US","SUV","AWD","Electric",2023,2024,550],
["Lordstown","Endurance",2023,"US","Truck","4WD","Electric",2023,2023,280],
["Scout","Traveler EV",2025,"US","SUV","4WD","Electric",2025,2025,297],
["Faraday Future","FF91",2023,"US","Sedan","AWD","Electric",2023,2024,330],
["VinFast","VF8",2023,"US","SUV","AWD","Electric",2023,2025,402],
["Shelby","Super Snake (S550)",2018,"US","Coupe","RWD","V8",2018,2022,800],
["Ferrari","Portofino M",2021,"IT","Convertible","RWD","V8",2021,2023,612],
["Ferrari","GTC4Lusso",2016,"IT","Coupe","AWD","V12",2016,2020,680],
["Ferrari","599 GTO",2010,"IT","Coupe","RWD","V12",2010,2011,661],
["Ferrari","California T",2014,"IT","Convertible","RWD","V8",2014,2017,553],
["Ferrari","F12 Berlinetta",2012,"IT","Coupe","RWD","V12",2012,2017,731],
["Ferrari","330 P4",1967,"IT","Coupe","RWD","V12",1967,1967,450],
["Lamborghini","Sián",2020,"IT","Coupe","AWD","V12",2020,2021,808],
["Lamborghini","LM002",1986,"IT","SUV","4WD","V12",1986,1993,450],
["Lamborghini","Urraco P250",1973,"IT","Coupe","RWD","V8",1973,1979,220],
["Maserati","Levante Trofeo",2019,"IT","SUV","AWD","V8",2019,2023,580],
["Maserati","GranTurismo Folgore",2024,"IT","Coupe","AWD","Electric",2024,2025,330],
["Maserati","Grecale Trofeo",2023,"IT","SUV","AWD","V6",2023,2025,523],
["Alfa Romeo","Giulietta QV (940)",2010,"IT","Hatchback","FWD","I4",2010,2020,240],
["Alfa Romeo","Brera",2006,"IT","Coupe","FWD","V6",2006,2010,260],
["Alfa Romeo","147 GTA",2003,"IT","Hatchback","FWD","V6",2003,2006,247],
["Alfa Romeo","SZ (ES 30)",1989,"IT","Coupe","RWD","V6",1989,1991,210],
["Lancia","Rally 037",1982,"IT","Coupe","RWD","I4",1982,1983,127],
["Fiat","Coupe 20V Turbo",1996,"IT","Coupe","FWD","I5",1993,2000,220],
["Fiat","131 Abarth Rally",1976,"IT","Sedan","RWD","I4",1976,1982,140],
["Fiat","Multipla",1998,"IT","Minivan","FWD","I4",1998,2010,103],
["Fiat","Topolino EV",2024,"IT","Hatchback","FWD","Electric",2024,2025,8],
["Lancia","Beta Montecarlo",1975,"IT","Coupe","RWD","I4",1975,1981,120],
["Abarth","595 Competizione",2014,"IT","Hatchback","FWD","I4",2014,2023,180],
["Abarth","124 Rally",2017,"IT","Roadster","RWD","I4",2017,2019,170],
["Aston Martin","V12 Vantage (2022)",2022,"UK","Coupe","RWD","V12",2022,2024,660],
["Aston Martin","Rapide AMR",2019,"UK","Sedan","RWD","V12",2019,2020,580],
["Aston Martin","DB9 GT",2016,"UK","Coupe","RWD","V12",2016,2016,540],
["Jaguar","XFR-S",2014,"UK","Sedan","RWD","V8",2014,2015,542],
["Jaguar","XKR-S",2012,"UK","Coupe","RWD","V8",2012,2014,542],
["Jaguar","XE (X760)",2015,"UK","Sedan","RWD","I4",2015,2023,296],
["Land Rover","Range Rover Velar SVAutobiography",2019,"UK","SUV","AWD","V8",2019,2024,360],
["Land Rover","Defender V8 (L663)",2022,"UK","SUV","AWD","V8",2022,2025,518],
["Land Rover","Freelander 2",2007,"UK","SUV","AWD","I6",2007,2014,230],
["Lotus","Eletre",2024,"UK","SUV","AWD","Electric",2024,2025,893],
["Lotus","Emeya",2024,"UK","Sedan","AWD","Electric",2024,2025,893],
["McLaren","GT",2020,"UK","Coupe","RWD","V8",2020,2025,612],
["McLaren","570S",2015,"UK","Coupe","RWD","V8",2015,2021,562],
["McLaren","540C",2016,"UK","Coupe","RWD","V8",2016,2020,533],
["TVR","Tuscan Speed 6",1999,"UK","Coupe","RWD","I6",1999,2006,360],
["TVR","Chimaera",1993,"UK","Roadster","RWD","V8",1993,2003,340],
["Bentley","Flying Spur Speed",2022,"UK","Sedan","AWD","W12",2022,2025,626],
["Bentley","Mulliner Bacalar",2021,"UK","Roadster","AWD","W12",2021,2021,660],
["Bentley","Continental Supersports",2017,"UK","Coupe","AWD","W12",2017,2018,600],
["Rolls-Royce","Ghost Black Badge",2022,"UK","Sedan","AWD","V12",2022,2025,591],
["Rolls-Royce","Cullinan Black Badge",2020,"UK","SUV","AWD","V12",2020,2025,591],
["Rolls-Royce","Phantom VIII",2018,"UK","Sedan","RWD","V12",2018,2025,563],
["Mini","Countryman JCW (F60)",2020,"UK","SUV","AWD","I4",2020,2025,135],
["Mini","Electric (SE)",2020,"UK","Hatchback","FWD","Electric",2020,2025,255],
["Vauxhall","VXR8 GTS-R",2017,"UK","Sedan","RWD","V8",2017,2018,585],
["Ginetta","G40",2010,"UK","Coupe","RWD","I4",2010,2025,175],
["Ultima","RS",2019,"UK","Coupe","RWD","V8",2019,2025,1020],
["Westfield","Sport 250",2010,"UK","Roadster","RWD","I4",2010,2025,150],
["Peugeot","308 GTi",2016,"FR","Hatchback","FWD","I4",2015,2021,270],
["Peugeot","208 GTi",2013,"FR","Hatchback","FWD","I4",2013,2019,208],
["Peugeot","e-208 GT",2020,"FR","Hatchback","FWD","Electric",2020,2025,255],
["Peugeot","3008 GT",2021,"FR","SUV","FWD","I4",2021,2025,148],
["Renault","Clio RS 200 (Mk4)",2013,"FR","Hatchback","FWD","I4",2013,2018,200],
["Renault","Mégane E-Tech Electric",2022,"FR","Hatchback","FWD","Electric",2022,2025,280],
["Renault","Zoe",2013,"FR","Hatchback","FWD","Electric",2013,2024,255],
["Renault","Twingo RS",2008,"FR","Hatchback","FWD","I4",2008,2013,133],
["Renault","Kangoo",2021,"FR","Van","FWD","I4",2021,2025,99],
["Citroën","C4 Cactus",2014,"FR","Hatchback","FWD","I4",2014,2020,127],
["Citroën","ë-C4",2021,"FR","Hatchback","FWD","Electric",2021,2025,280],
["DS","DS 3 Performance",2016,"FR","Hatchback","FWD","I4",2016,2019,208],
["DS","DS 9",2021,"FR","Sedan","FWD","I4",2021,2025,225],
["Volvo","S60 Polestar",2015,"SE","Sedan","AWD","I6",2015,2018,362],
["Volvo","XC60 Recharge",2022,"SE","SUV","AWD","I4",2022,2025,148],
["Volvo","V90 Cross Country",2017,"SE","Wagon","AWD","I4",2017,2025,150],
["Volvo","C40 Recharge",2022,"SE","SUV","AWD","Electric",2022,2025,297],
["Volvo","EX30",2024,"SE","SUV","RWD","Electric",2024,2025,297],
["Koenigsegg","CC8S",2002,"SE","Coupe","RWD","V8",2002,2004,494],
["Polestar","4",2025,"SE","SUV","AWD","Electric",2025,2025,297],
["Polestar","6 BST edition 270",2026,"SE","Roadster","AWD","Electric",2026,2026,330],
["Hyundai","N Vision 74 Concept",2022,"KR","Coupe","RWD","Electric",2022,2022,330],
["Hyundai","Palisade",2020,"KR","SUV","AWD","V6",2020,2025,291],
["Hyundai","Santa Fe (MX5)",2024,"KR","SUV","AWD","I4",2024,2025,148],
["Hyundai","Sonata N Line (DN8)",2021,"KR","Sedan","FWD","I4",2021,2024,290],
["Hyundai","Ioniq 9",2025,"KR","SUV","AWD","Electric",2025,2025,297],
["Genesis","G90 (RS4)",2023,"KR","Sedan","AWD","V6",2023,2025,375],
["Genesis","GV70 Electrified",2023,"KR","SUV","AWD","Electric",2023,2025,297],
["Kia","Sportage HEV (NQ5)",2023,"KR","SUV","AWD","I4",2023,2025,148],
["Kia","Carnival (KA4)",2022,"KR","Minivan","FWD","V6",2022,2025,215],
["Kia","K5 GT",2021,"KR","Sedan","FWD","I4",2021,2025,290],
["Kia","Soul EV (SK3)",2020,"KR","Hatchback","FWD","Electric",2020,2025,255],
["Kia","Niro EV (SG2)",2023,"KR","SUV","FWD","Electric",2023,2025,297],
["Škoda","Kodiaq RS",2019,"CZ","SUV","AWD","I4",2019,2025,240],
["Škoda","Octavia RS (Mk4)",2020,"CZ","Sedan","AWD","I4",2020,2025,245],
["Škoda","Enyaq Coupe iV RS",2022,"CZ","SUV","AWD","Electric",2022,2025,297],
["Cupra","Tavascan",2024,"ES","SUV","AWD","Electric",2024,2025,340],
["Cupra","Leon VZ",2021,"ES","Hatchback","AWD","I4",2021,2025,310],
["Arrinera","Hussarya GT",2016,"PL","Coupe","RWD","V8",2016,2020,650],
["TOGG","T10X",2023,"TR","SUV","AWD","Electric",2023,2025,400],
["Zeekr","007",2024,"CN","Sedan","AWD","Electric",2024,2025,330],
["BYD","Tang EV",2022,"CN","SUV","AWD","Electric",2022,2025,297],
["BYD","Han EV",2020,"CN","Sedan","AWD","Electric",2020,2025,300],
["BYD","Dolphin",2023,"CN","Hatchback","FWD","Electric",2023,2025,280],
["NIO","ES8",2018,"CN","SUV","AWD","Electric",2018,2025,270],
["NIO","EP9",2016,"CN","Coupe","AWD","Electric",2016,2017,1341],
["Li Auto","L9",2022,"CN","SUV","AWD","I4",2022,2025,148],
["XPeng","G6",2023,"CN","SUV","AWD","Electric",2023,2025,297],
["XPeng","X9",2024,"CN","Minivan","AWD","Electric",2024,2025,230],
["Xiaomi","SU7 Ultra",2025,"CN","Sedan","AWD","Electric",2025,2025,1548],
["Chery","Tiggo 8 Pro",2021,"CN","SUV","AWD","I4",2021,2025,148],
["MG","MG4 XPower",2023,"CN","Hatchback","AWD","Electric",2023,2025,280],
["GWM","Tank 500",2022,"CN","SUV","4WD","V6",2022,2025,277],
["Lynk & Co","03+",2019,"CN","Sedan","AWD","I4",2019,2025,150],
["Lotus","Emeya R",2024,"CN","Sedan","AWD","Electric",2024,2025,330],
["Hongqi","E-HS9",2021,"CN","SUV","AWD","Electric",2021,2025,297],
["Ford","Falcon XR8 Sprint (FG X)",2016,"AU","Sedan","RWD","V8",2016,2016,471],
["Holden","Torana A9X",1978,"AU","Coupe","RWD","V8",1978,1979,212],
["Holden","Commodore VF SS-V Redline",2014,"AU","Sedan","RWD","V8",2014,2017,407],
["HSV","GTSR W1",2017,"AU","Sedan","RWD","V8",2017,2017,636],
["Tata","Nexon EV Max",2022,"IN","SUV","FWD","Electric",2022,2025,143],
["Mahindra","XUV700",2021,"IN","SUV","AWD","I4",2021,2025,200],
["Maruti Suzuki","Jimny (India)",2023,"IN","SUV","4WD","I4",2023,2025,148],
["Toyota","Fortuner",2016,"JP","SUV","4WD","V6",2016,2025,252],
["Volkswagen","Gol GTI (G1)",1988,"DE","Hatchback","FWD","I4",1988,1996,107],
["Campagna","T-Rex",2005,"CA","Roadster","RWD","I4",2005,2025,160],
["VUHL","05",2013,"MX","Roadster","RWD","I4",2013,2025,385],
["IKA","Torino 380",1967,"AR","Coupe","RWD","I6",1967,1981,170],
// ══════════ FINAL BATCH: Pushing past 1000 ══════════
["Toyota","Alphard (40 Series)",2023,"JP","Minivan","AWD","I4",2023,2025,275],
["Toyota","GR Supra GRMN",2025,"JP","Coupe","RWD","I6",2025,2025,435],
["Toyota","Corolla GR-S",2022,"JP","Sedan","FWD","I4",2022,2025,165],
["Toyota","Land Cruiser 70 (Re-release)",2024,"JP","SUV","4WD","I4",2024,2025,204],
["Toyota","Century SUV",2024,"JP","SUV","AWD","V6",2024,2025,413],
["Nissan","Sakura EV",2022,"JP","Hatchback","FWD","Electric",2022,2025,64],
["Nissan","Cefiro (A31)",1988,"JP","Sedan","RWD","I6",1988,1994,215],
["Nissan","Laurel (C35)",1997,"JP","Sedan","RWD","I6",1997,2002,250],
["Nissan","180SX",1989,"JP","Coupe","RWD","I4",1989,1998,205],
["Honda","Civic Si (11th Gen)",2022,"JP","Sedan","FWD","I4",2022,2025,200],
["Honda","ZR-V",2023,"JP","SUV","AWD","I4",2023,2025,190],
["Honda","Prelude (6th Gen / 2025)",2025,"JP","Coupe","AWD","I4",2025,2025,204],
["Honda","Prologue",2024,"JP","SUV","AWD","Electric",2024,2025,288],
["Mazda","CX-70",2025,"JP","SUV","AWD","I6",2025,2025,280],
["Mazda","CX-80",2024,"JP","SUV","AWD","I6",2024,2025,254],
["Subaru","WRX tS",2018,"JP","Sedan","AWD","Flat-4",2018,2019,150],
["Subaru","Impreza (6th Gen)",2024,"JP","Hatchback","AWD","Flat-4",2024,2025,152],
["Mitsubishi","Colt Ralliart",2023,"JP","Hatchback","FWD","I4",2023,2025,140],
["Lexus","TX 350 F Sport",2024,"JP","SUV","AWD","V6",2024,2025,275],
["Porsche","911 Dakar (992)",2023,"DE","Coupe","AWD","Flat-6",2023,2025,473],
["Porsche","Cayenne Turbo E-Hybrid (E3.2)",2024,"DE","SUV","AWD","V8",2024,2025,729],
["Porsche","Taycan Cross Turismo",2022,"DE","Wagon","AWD","Electric",2022,2025,616],
["BMW","XM",2023,"DE","SUV","AWD","V8",2023,2025,644],
["BMW","M3 Touring (G81)",2023,"DE","Wagon","AWD","I6",2023,2025,503],
["BMW","i5 M60",2024,"DE","Sedan","AWD","Electric",2024,2025,593],
["BMW","iX2 xDrive30",2024,"DE","SUV","AWD","Electric",2024,2025,313],
["Mercedes-Benz","AMG C63 S E Performance Estate",2024,"DE","Wagon","AWD","I4",2024,2025,671],
["Mercedes-Benz","EQG",2025,"DE","SUV","AWD","Electric",2025,2025,579],
["Mercedes-Benz","CLE 53 AMG",2024,"DE","Coupe","AWD","I4",2024,2025,443],
["Audi","RS e-tron GT Performance",2025,"DE","Sedan","AWD","Electric",2025,2025,912],
["Audi","Q6 e-tron",2024,"DE","SUV","AWD","Electric",2024,2025,297],
["Volkswagen","ID.7 GTX",2024,"DE","Sedan","AWD","Electric",2024,2025,330],
["Ford","Mustang GTD (S650)",2025,"US","Coupe","RWD","V8",2025,2025,800],
["Chevrolet","Corvette C8 ZR1",2025,"US","Coupe","RWD","V8",2025,2025,1064],
["Chevrolet","Equinox EV RS",2024,"US","SUV","AWD","Electric",2024,2025,297],
["Dodge","Charger Sixpack (2025)",2025,"US","Coupe","RWD","V8",2025,2025,420],
["Dodge","Charger Daytona Scat Pack",2024,"US","Sedan","RWD","Electric",2024,2025,670],
["Ram","1500 Ramcharger",2025,"US","Truck","4WD","V6",2025,2025,261],
["Cadillac","Optiq",2025,"US","SUV","AWD","Electric",2025,2025,297],
["Cadillac","Vistiq",2025,"US","SUV","AWD","Electric",2025,2025,297],
["Ferrari","12 Cilindri",2025,"IT","Coupe","RWD","V12",2025,2025,819],
["Lamborghini","Sterrato",2023,"IT","Coupe","AWD","V10",2023,2024,601],
["McLaren","750S",2024,"UK","Coupe","RWD","V8",2024,2025,740],
["McLaren","GTS",2024,"UK","Coupe","RWD","V8",2024,2025,631],
["Aston Martin","Valhalla",2025,"UK","Coupe","AWD","V8",2025,2025,937],
["Rolls-Royce","Ghost Series II",2024,"UK","Sedan","AWD","V12",2024,2025,660],
["Bentley","Continental GT Speed (4th Gen)",2025,"UK","Coupe","AWD","V8",2025,2025,771],
["Alpine","A390",2025,"FR","SUV","AWD","Electric",2025,2025,297],
["Renault","Rafale",2024,"FR","SUV","AWD","I4",2024,2025,148],
["Citroën","ë-C3",2024,"FR","Hatchback","FWD","Electric",2024,2025,280],
["Peugeot","E-3008",2024,"FR","SUV","FWD","Electric",2024,2025,297],
["Volvo","EX40",2025,"SE","SUV","AWD","Electric",2025,2025,297],
["Koenigsegg","CC850",2024,"SE","Coupe","RWD","V8",2024,2025,1385],
["Hyundai","Inster",2025,"KR","Hatchback","FWD","Electric",2025,2025,280],
["Kia","EV3",2025,"KR","SUV","FWD","Electric",2025,2025,297],
["Genesis","GV80 Coupe EV",2026,"KR","SUV","AWD","Electric",2026,2026,297],
["Škoda","Elroq",2025,"CZ","SUV","AWD","Electric",2025,2025,297],
["Cupra","Terramar",2025,"ES","SUV","AWD","I4",2025,2025,265],
["BYD","Yangwang U8",2023,"CN","SUV","4WD","Electric",2023,2025,297],
["BYD","Song Plus EV",2022,"CN","SUV","FWD","Electric",2022,2025,297],
["NIO","ET5 Touring",2023,"CN","Wagon","AWD","Electric",2023,2025,330],
["Zeekr","009",2023,"CN","Minivan","AWD","Electric",2023,2025,230],
["Li Auto","Mega",2024,"CN","Minivan","AWD","Electric",2024,2025,230],
["Xiaomi","YU7",2025,"CN","SUV","AWD","Electric",2025,2025,297],
["Rivian","R2",2026,"US","SUV","AWD","Electric",2026,2026,330],
["Lucid","Gravity",2025,"US","SUV","AWD","Electric",2025,2025,828],
["Polestar","5",2025,"SE","Sedan","AWD","Electric",2025,2025,330],
["Rimac","Nevera R",2025,"HR","Coupe","AWD","Electric",2025,2025,330],
["Lotus","Theory 1",2025,"UK","Coupe","AWD","Electric",2025,2025,330],
["Porsche","K1 EV",2026,"DE","SUV","AWD","Electric",2026,2026,600],
["Pagani","Utopia Roadster",2025,"IT","Roadster","RWD","V12",2025,2025,858],
["Maserati","MC20 Cielo",2023,"IT","Convertible","RWD","V6",2023,2025,308],
["Gordon Murray","T.50s Niki Lauda",2023,"UK","Coupe","RWD","V12",2023,2023,660],
["Dacia","Spring Electric",2021,"RO","Hatchback","FWD","Electric",2021,2025,65],
["Tata","Curvv EV",2024,"IN","SUV","FWD","Electric",2024,2025,297],
["Holden","Special Vehicles GTS (VF II)",2016,"AU","Sedan","RWD","V8",2016,2017,430],
// ══════════ GAP FILL: Notable missing cars ══════════
["Hummer","H3",2006,"US","SUV","4WD","I5",2006,2010,242],
// Iconic classics & missing generations
["Porsche","911 Carrera S (997)",2005,"DE","Coupe","RWD","Flat-6",2005,2012,355],
["Porsche","Boxster S (987)",2005,"DE","Roadster","RWD","Flat-6",2005,2012,295],
["Ferrari","365 GTB/4 Daytona",1968,"IT","Coupe","RWD","V12",1968,1973,352],
["Jensen","Interceptor",1966,"UK","Coupe","RWD","V8",1966,1976,325],
["AC","Cobra 289",1963,"UK","Roadster","RWD","V6",1962,1965,271],
["Triumph","Spitfire",1962,"UK","Roadster","RWD","I4",1962,1980,75],
["Triumph","Stag",1970,"UK","Convertible","RWD","V8",1970,1977,145],
["MG","Midget",1961,"UK","Roadster","RWD","I4",1961,1979,65],
["Iso","Grifo",1965,"IT","Coupe","RWD","V8",1965,1974,365],
["Saab","9-5 Aero",2000,"SE","Sedan","FWD","I4",1999,2010,250],
["Volvo","XC40 Recharge",2021,"SE","SUV","AWD","Electric",2021,2025,297],
// Land Rover gaps
["Land Rover","Range Rover (L405)",2013,"UK","SUV","AWD","V8",2013,2022,510],
["Land Rover","Range Rover (L460)",2022,"UK","SUV","AWD","V8",2022,2025,523],
["Land Rover","Range Rover Evoque",2012,"UK","SUV","AWD","I4",2012,2025,135],
// Missing Japanese staples
["Toyota","Celica (1st Gen)",1970,"JP","Coupe","RWD","I4",1970,1977,105],
["Toyota","Highlander Hybrid",2020,"JP","SUV","AWD","I4",2020,2025,243],
["Toyota","Tacoma (4th Gen)",2024,"JP","Truck","4WD","I4",2024,2025,278],
["Toyota","Land Cruiser Prado (J150)",2010,"JP","SUV","4WD","V6",2010,2024,270],
["Toyota","Sienna",2021,"JP","Minivan","AWD","I4",2021,2025,245],
["Nissan","Pathfinder (R53)",2022,"JP","SUV","4WD","V6",2022,2025,284],
["Nissan","Titan (A61)",2017,"JP","Truck","4WD","V8",2017,2025,400],
["Honda","Pilot (4th Gen)",2023,"JP","SUV","AWD","V6",2023,2025,285],
["Isuzu","Trooper (UBS)",1991,"JP","SUV","4WD","V6",1991,2002,190],
// Missing German staples
["Volkswagen","Passat (B8)",2015,"DE","Sedan","FWD","I4",2015,2023,174],
["Volkswagen","Passat (B9)",2024,"DE","Wagon","FWD","I4",2024,2025,271],
["Mercedes-Benz","GLE 53 AMG (V167)",2020,"DE","SUV","AWD","I6",2020,2025,429],
["Mercedes-Benz","280SL Pagoda (W113)",1963,"DE","Roadster","RWD","I6",1963,1971,170],
["BMW","X3 M40i (G01)",2018,"DE","SUV","AWD","I6",2018,2025,382],
// Missing American staples
["Jeep","Liberty (KJ)",2002,"US","SUV","4WD","V6",2002,2007,210],
["Jeep","Wagoneer (WS)",2022,"US","SUV","4WD","V8",2022,2025,396],
["GMC","Sierra 1500 Denali (T1)",2019,"US","Truck","4WD","V8",2019,2025,340],
["Ford","Expedition (3rd Gen)",2007,"US","SUV","4WD","V8",2007,2017,310],
["Chevrolet","Express Van",2003,"US","Van","RWD","V8",2003,2025,276],
["Dodge","Grand Caravan",2011,"US","Minivan","FWD","V6",2011,2020,283],
["Chrysler","Town & Country",2008,"US","Minivan","FWD","V6",2008,2016,283],
["Mercury","Cougar (1st Gen)",1967,"US","Coupe","RWD","V8",1967,1970,390],
["Oldsmobile","Cutlass 442",1964,"US","Coupe","RWD","V8",1964,1972,310],
["Buick","GSX Stage 1",1970,"US","Coupe","RWD","V8",1970,1972,360],
// Missing British classics
["Austin-Healey","Sprite",1958,"UK","Roadster","RWD","I4",1958,1971,46],
["Sunbeam","Tiger",1964,"UK","Roadster","RWD","V8",1964,1967,260],
["Lotus","Carlton",1990,"UK","Sedan","RWD","I6",1990,1992,377],
["Lotus","Elise S2",2001,"UK","Roadster","RWD","I4",2001,2011,189],
// Missing Italian
["Lancia","Aurelia B20 GT",1951,"IT","Coupe","RWD","V6",1951,1958,118],
["Fiat","Dino Spider",1966,"IT","Roadster","RWD","V6",1966,1973,196],
["Ferrari","550 Maranello",1996,"IT","Coupe","RWD","V12",1996,2001,485],
["Lamborghini","Veneno",2013,"IT","Coupe","AWD","V12",2013,2014,740],
["Maserati","250F",1954,"IT","Roadster","RWD","I6",1954,1958,270],
// Missing French
["Citroën","Traction Avant",1934,"FR","Sedan","FWD","I4",1934,1957,46],
["Renault","4CV",1947,"FR","Sedan","RWD","I4",1947,1961,21],
["Peugeot","504 Coupe",1969,"FR","Coupe","RWD","I4",1969,1983,104],
["Alpine","A610",1991,"FR","Coupe","RWD","V6",1991,1995,250],
// Korean / other
["Hyundai","Grandeur (GN7)",2023,"KR","Sedan","FWD","I4",2023,2025,191],
["Kia","Sorento (MQ4)",2021,"KR","SUV","AWD","I4",2021,2025,281],
["Genesis","Electrified G80",2022,"KR","Sedan","AWD","Electric",2022,2025,330],
// ══════════ AUDIT FILL: Notable missing models ══════════
// Jaguar
["Jaguar","F-Pace SVR",2019,"UK","SUV","AWD","V8",2019,2024,550],
["Jaguar","E-Pace P300",2018,"UK","SUV","AWD","I4",2018,2025,135],
// BMW
["BMW","X7 M60i",2023,"DE","SUV","AWD","V8",2023,2025,523],
["BMW","i3 (I01)",2014,"DE","Hatchback","RWD","Electric",2014,2022,170],
["BMW","M4 Competition (G82)",2021,"DE","Coupe","AWD","I6",2021,2025,503],
["BMW","X4 M Competition",2020,"DE","SUV","AWD","I6",2020,2025,503],
// Mercedes
["Mercedes-Benz","CLS 63 AMG (C218)",2012,"DE","Sedan","RWD","V8",2012,2018,550],
["Mercedes-Benz","ML 63 AMG (W166)",2012,"DE","SUV","AWD","V8",2012,2015,518],
["Mercedes-Benz","SLK 55 AMG (R172)",2012,"DE","Roadster","RWD","V8",2012,2016,415],
["Mercedes-Benz","GLB 35 AMG",2020,"DE","SUV","AWD","I4",2020,2025,302],
// Audi
["Audi","A3 S-line (8Y)",2021,"DE","Sedan","FWD","I4",2021,2025,165],
["Audi","A6 Avant (C8)",2019,"DE","Wagon","AWD","V6",2019,2025,261],
["Audi","A7 Sportback (C8)",2019,"DE","Sedan","AWD","V6",2019,2025,280],
["Audi","Q5 Sportback",2021,"DE","SUV","AWD","I4",2021,2025,261],
["Audi","Q7 (4M)",2016,"DE","SUV","AWD","V6",2016,2025,335],
// Aston Martin
["Aston Martin","Vanquish (2001)",2001,"UK","Coupe","RWD","V12",2001,2007,460],
["Aston Martin","DB7",1994,"UK","Coupe","RWD","I6",1994,2004,335],
// McLaren
["McLaren","MP4-12C",2011,"UK","Coupe","RWD","V8",2011,2014,592],
["McLaren","650S",2014,"UK","Coupe","RWD","V8",2014,2017,641],
// Ford
["Ford","Escape (4th Gen)",2020,"US","SUV","AWD","I4",2020,2025,250],
["Ford","Fusion Sport",2017,"US","Sedan","AWD","V6",2013,2020,325],
["Ford","Ranchero",1957,"US","Truck","RWD","V8",1957,1979,220],
["Ford","Excursion",2000,"US","SUV","4WD","V8",2000,2005,310],
// Chevrolet
["Chevrolet","Cobalt SS",2005,"US","Coupe","FWD","I4",2005,2010,260],
["Chevrolet","S-10 (2nd Gen)",1994,"US","Truck","RWD","V6",1994,2004,180],
// Nissan
["Nissan","Qashqai (J12)",2021,"JP","SUV","AWD","I4",2021,2025,188],
["Nissan","X-Trail (T33)",2022,"JP","SUV","AWD","I4",2022,2025,201],
["Nissan","Armada (Y62)",2017,"JP","SUV","4WD","V8",2017,2025,400],
// Lotus
["Lotus","Evora GT",2020,"UK","Coupe","RWD","V6",2010,2021,416],
// Rolls-Royce
["Rolls-Royce","Wraith",2014,"UK","Coupe","RWD","V12",2014,2023,624],
["Rolls-Royce","Dawn",2016,"UK","Convertible","RWD","V12",2016,2023,563],
// Bentley
["Bentley","Mulsanne",2010,"UK","Sedan","RWD","V8",2010,2020,505],
// Lincoln
["Lincoln","Town Car (3rd Gen)",1998,"US","Sedan","RWD","V8",1998,2011,239],
// VW
["Volkswagen","Atlas Cross Sport",2020,"US","SUV","AWD","V6",2020,2025,276],
["Volkswagen","Eos",2006,"DE","Convertible","FWD","I4",2006,2016,200],
["Volkswagen","Touareg V8 (7P)",2011,"DE","SUV","AWD","V8",2011,2018,360],
// Volvo
["Volvo","S90 (2nd Gen)",2017,"SE","Sedan","AWD","I4",2017,2025,316],
["Volvo","V40 T5",2013,"SE","Hatchback","FWD","I5",2013,2019,245],
["Volvo","XC70 (2nd Gen)",2008,"SE","Wagon","AWD","I6",2008,2016,281],
// Citroën
["Citroën","CX GTi Turbo",1985,"FR","Sedan","FWD","I4",1974,1991,168],
["Citroën","XM",1989,"FR","Sedan","FWD","V6",1989,2000,200],
// Peugeot
["Peugeot","RCZ R",2013,"FR","Coupe","FWD","I4",2010,2015,270],
["Peugeot","406 Coupe V6",1997,"FR","Coupe","FWD","V6",1997,2003,194],
// Maserati
["Maserati","Biturbo",1981,"IT","Coupe","RWD","V6",1981,1994,185],
["Maserati","Khamsin",1974,"IT","Coupe","RWD","V8",1974,1982,320],
["Maserati","Shamal",1990,"IT","Coupe","RWD","V8",1990,1996,326],
// Fiat
["Fiat","Barchetta",1995,"IT","Roadster","FWD","I4",1995,2005,130],
// Mitsubishi
["Mitsubishi","Galant VR-4",1988,"JP","Sedan","AWD","I4",1988,1992,195],
// TVR
["TVR","Tamora",2002,"UK","Coupe","RWD","I6",2002,2006,350],
// AMC
["AMC","Gremlin",1970,"US","Hatchback","RWD","I6",1970,1978,150],
["AMC","Pacer",1975,"US","Hatchback","RWD","I6",1975,1980,120],
// Oldsmobile
["Oldsmobile","Toronado",1966,"US","Coupe","FWD","V8",1966,1992,385],
// Plymouth
["Plymouth","GTX",1967,"US","Coupe","RWD","V8",1967,1971,375],
["Plymouth","Fury",1956,"US","Sedan","RWD","V8",1956,1978,290],
// Jeep
["Jeep","Commander (XK)",2006,"US","SUV","4WD","V8",2006,2010,330],
// GMC
["GMC","Jimmy (S-15)",1983,"US","SUV","4WD","V6",1983,2001,190],
["GMC","Envoy (GMT360)",2002,"US","SUV","4WD","I6",2002,2009,275],
// Saab
["Saab","99 Turbo",1978,"SE","Coupe","FWD","I4",1978,1984,145],
// Smart
["Smart","Roadster",2003,"DE","Roadster","RWD","I3",2003,2006,80],
// Subaru
["Subaru","XT Turbo",1985,"JP","Coupe","4WD","Flat-4",1985,1991,111],
["Subaru","Tribeca",2006,"JP","SUV","AWD","Flat-6",2006,2014,256],
// Kia
["Kia","Optima GT (JF)",2016,"KR","Sedan","FWD","I4",2016,2020,245],
// Toyota
["Toyota","Avalon (XX50)",2019,"JP","Sedan","FWD","V6",2019,2024,301],
["Toyota","Previa",1990,"JP","Minivan","AWD","I4",1990,2000,138],
// Honda
["Honda","Insight (3rd Gen)",2019,"JP","Sedan","FWD","I4",2019,2022,151],
// Lexus
["Lexus","RX 350 (AL20)",2016,"JP","SUV","AWD","V6",2016,2022,295],
["Lexus","LS 460 (XF40)",2007,"JP","Sedan","RWD","V8",2007,2017,380],
// Porsche
["Porsche","911 GT3 (991.1)",2014,"DE","Coupe","RWD","Flat-6",2013,2016,475],
["Porsche","Cayenne (955)",2003,"DE","SUV","AWD","V8",2003,2010,340],
["Porsche","Boxster S (981)",2013,"DE","Roadster","RWD","Flat-6",2013,2016,315],
// Hyundai
["Hyundai","Venue",2020,"KR","SUV","FWD","I4",2020,2025,121],
// Alfa Romeo
["Alfa Romeo","MiTo QV",2009,"IT","Hatchback","FWD","I4",2008,2018,170],
];


/* ═══════════════════════════════════════════════════════════════════
   DATA PROCESSING
   ═══════════════════════════════════════════════════════════════════ */
const COUNTRY_MAP = {JP:"Japan",DE:"Germany",US:"USA",IT:"Italy",UK:"UK",FR:"France",SE:"Sweden",KR:"South Korea",HR:"Croatia",AE:"UAE",IN:"India",AU:"Australia",CZ:"Czechia",NL:"Netherlands",ES:"Spain",AT:"Austria",RO:"Romania",MY:"Malaysia",CN:"China",PL:"Poland",TR:"Turkey",CA:"Canada",MX:"Mexico",AR:"Argentina"};
const FLAG_MAP = {JP:"🇯🇵",DE:"🇩🇪",US:"🇺🇸",IT:"🇮🇹",UK:"🇬🇧",FR:"🇫🇷",SE:"🇸🇪",KR:"🇰🇷",HR:"🇭🇷",AE:"🇦🇪",IN:"🇮🇳",AU:"🇦🇺",CZ:"🇨🇿",NL:"🇳🇱",ES:"🇪🇸",AT:"🇦🇹",RO:"🇷🇴",MY:"🇲🇾",CN:"🇨🇳",PL:"🇵🇱",TR:"🇹🇷",CA:"🇨🇦",MX:"🇲🇽",AR:"🇦🇷"};

const CARS = RAW.map(r => ({
  make:r[0], model:r[1], year:r[2], country:COUNTRY_MAP[r[3]]||r[3],
  countryCode:r[3], body:r[4], drive:r[5], motor:r[6],
  spanStart:r[7]||r[2], spanEnd:r[8]||r[2], hp:r[9]||0
}));

const MAX_GUESSES = 8;
const LAUNCH_EPOCH = new Date("2026-03-28T00:00:00");
// Comparison columns:
const COLS = ["make","year","country","body","drive","motor","hp"];
const COL_LABELS = ["MAKE","YEAR","CTRY","BODY","DRIVE","MOTOR","HP"];

function getDayNumber() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const launch = new Date(LAUNCH_EPOCH.getFullYear(), LAUNCH_EPOCH.getMonth(), LAUNCH_EPOCH.getDate());
  return Math.floor((today - launch) / 86400000) + 1;
}
function getDailyCarIndex() { return DAILY_POOL[((getDayNumber() * 2654435761) >>> 0) % DAILY_POOL.length]; }

/* ═══════════════════════════════════════════════════════════════════
   EDITORIAL SCHEDULE — Override daily puzzles for special dates
   
   Three layers (highest priority wins):
   1. Google Sheet override (production only — set SHEET_URL below)
   2. One-time dates: "YYYY-MM-DD" → specific car
   3. Recurring annual dates: "MM-DD" → specific car
   4. Fallback: algorithm picks randomly
   
   To set up Google Sheet:
   1. Create a Google Sheet with columns: date | make | model | note
   2. File → Share → Publish to web → CSV format
   3. Paste the URL below as SHEET_URL
   ═══════════════════════════════════════════════════════════════════ */

// Set this to your published Google Sheet CSV URL when ready (leave empty to skip)
const SHEET_URL = "";

// Find car index by make + model (partial match on model)
function findCar(make, model) {
  const idx = CARS.findIndex(c => 
    c.make.toLowerCase() === make.toLowerCase() && 
    c.model.toLowerCase().includes(model.toLowerCase())
  );
  return idx >= 0 ? idx : null;
}

// ── RECURRING ANNUAL DATES (MM-DD) ──
const ANNUAL_SCHEDULE = {
  // Automotive history
  "01-29": { make:"Chevrolet", model:"Corvette", note:"Corvette's birthday (1953)" },
  "02-18": { make:"Ferrari", model:"F40", note:"Enzo Ferrari's birthday" },
  "03-22": { make:"Porsche", model:"356 Speedster", note:"Porsche's first car delivered (1950)" },
  "04-14": { make:"Ford", model:"Mustang (1st Gen)", note:"Ford Mustang debut at World's Fair (1964)" },
  "04-25": { make:"Lamborghini", model:"Miura", note:"Lamborghini founding day (1963)" },
  "05-26": { make:"Ford", model:"GT40", note:"Indy 500 weekend" },
  "06-11": { make:"Ford", model:"GT40", note:"Le Mans 24h weekend" },
  "06-25": { make:"Mazda", model:"787B", note:"Mazda's Le Mans win (1991)" },
  "07-25": { make:"Bugatti", model:"Veyron", note:"Bugatti's founding day (1909)" },
  "08-21": { make:"Toyota", model:"AE86", note:"Hachi-Roku Day (8/6 → August)" },
  "09-15": { make:"Nissan", model:"Skyline GT-R R32", note:"R32 GT-R launch anniversary (1989)" },
  "09-28": { make:"Porsche", model:"911 Carrera RS 2.7", note:"Porsche 911 debut at IAA (1963)" },
  "10-01": { make:"Honda", model:"NSX", note:"Honda founding day (1948)" },
  "10-05": { make:"Aston Martin", model:"DB5", note:"Global James Bond Day" },
  "10-21": { make:"DeLorean", model:"DMC-12", note:"Back to the Future Day" },
  "11-03": { make:"Toyota", model:"Supra", note:"Godzilla vs Supra — JDM legends day" },
  "11-16": { make:"Mercedes-Benz", model:"300SL", note:"Mercedes-Benz founding anniversary" },
  "12-25": { make:"Ferrari", model:"250 GTO", note:"Christmas — the ultimate gift car" },
  "12-31": { make:"Tesla", model:"Cybertruck", note:"New Year's Eve — future vibes" },
};

// ── ONE-TIME SCHEDULED DATES (YYYY-MM-DD) ──
// Add specific dates here for launches, events, promotions
const ONETIME_SCHEDULE = {
  // "2026-04-01": { make:"Fiat", model:"Multipla", note:"April Fools" },
  // "2026-07-04": { make:"Chevrolet", model:"Corvette C8", note:"Independence Day" },
};

// Resolve today's scheduled car (if any)
function getScheduledCarIndex() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const fullDate = `${yyyy}-${mm}-${dd}`;
  const annualDate = `${mm}-${dd}`;
  
  // Check one-time first (highest priority)
  let entry = ONETIME_SCHEDULE[fullDate];
  if (!entry) entry = ANNUAL_SCHEDULE[annualDate];
  if (!entry) return null;
  
  return findCar(entry.make, entry.model);
}

// Google Sheet override — fetched async, cached for the session
let sheetOverride = null;
let sheetFetched = false;

async function fetchSheetSchedule() {
  if (sheetFetched || !SHEET_URL) return null;
  sheetFetched = true;
  try {
    const res = await fetch(SHEET_URL);
    const csv = await res.text();
    const rows = csv.split("\n").slice(1); // skip header
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const today = `${yyyy}-${mm}-${dd}`;
    
    for (const row of rows) {
      const cols = row.split(",").map(c => c.trim().replace(/^"|"$/g, ""));
      if (cols[0] === today && cols[1] && cols[2]) {
        const idx = findCar(cols[1], cols[2]);
        if (idx !== null) { sheetOverride = idx; return idx; }
      }
    }
  } catch {}
  return null;
}

// Final daily car resolver: Sheet → One-time → Annual → Algorithm
function resolveDailyCarIndex() {
  if (sheetOverride !== null) return sheetOverride;
  const scheduled = getScheduledCarIndex();
  if (scheduled !== null) return scheduled;
  return getDailyCarIndex();
}

// Region mapping for "close" country detection
const REGION_MAP = {
  Japan:"Asia", "South Korea":"Asia", China:"Asia", India:"Asia", Malaysia:"Asia", UAE:"Asia", Turkey:"Asia",
  Germany:"Europe", Austria:"Europe", Netherlands:"Europe", Czechia:"Europe",
  France:"Europe", Spain:"Europe", Sweden:"Europe", Italy:"Europe", Romania:"Europe",
  UK:"Europe", Croatia:"Europe", Poland:"Europe",
  USA:"Americas", Canada:"Americas", Mexico:"Americas", Argentina:"Americas",
  Australia:"Oceania"
};

// Make family mapping — "close" if same family, different brand
const MAKE_FAMILY = {
  // Toyota group
  Toyota:"Toyota",Lexus:"Toyota",Scion:"Toyota",
  // Nissan group
  Nissan:"Nissan",Infiniti:"Nissan",Datsun:"Nissan",
  // Honda group
  Honda:"Honda",Acura:"Honda",
  // Hyundai group
  Hyundai:"Hyundai",Genesis:"Hyundai",
  // Ford group
  Ford:"Ford",Lincoln:"Ford",Mercury:"Ford",Shelby:"Ford",
  // VW group (tight only — not Porsche/Lambo/Bentley/Bugatti)
  Volkswagen:"VW",Audi:"VW",
  // Chrysler group
  Chrysler:"Chrysler",DeSoto:"Chrysler",
  // Dodge group
  Dodge:"Dodge",Plymouth:"Dodge",Ram:"Dodge",
  // GM family
  Chevrolet:"GM",GMC:"GM",Pontiac:"GM",Buick:"GM",Oldsmobile:"GM",Saturn:"GM",Cadillac:"GM",Hummer:"GM",
  // Holden group
  Holden:"Holden",HSV:"Holden",
  // Mercedes (same company, AMG is the performance arm)
  "Mercedes-Benz":"Mercedes","Mercedes-AMG":"Mercedes",
  // Fiat / Abarth (Abarth IS Fiat performance)
  Fiat:"Fiat",Abarth:"Fiat",
  // SEAT / Cupra (Cupra spun off from SEAT)
  SEAT:"SEAT",Cupra:"SEAT",
  // Opel / Vauxhall (same car, different market)
  Opel:"Opel",Vauxhall:"Opel",
  // Suzuki / Maruti Suzuki (same company in India)
  Suzuki:"Suzuki","Maruti Suzuki":"Suzuki",
};

function compareField(gv, tv, field) {
  if (field === "year") {
    if (gv === tv) return "correct";
    if (Math.abs(gv - tv) <= 5) return "close";
    return "wrong";
  }
  if (field === "hp") {
    if (gv === tv) return "correct";
    if (Math.abs(gv - tv) <= 50) return "close";
    return "wrong";
  }
  if (field === "country") {
    if (gv === tv) return "correct";
    const gr = REGION_MAP[gv], tr = REGION_MAP[tv];
    if (gr && tr && gr === tr) return "close";
    return "wrong";
  }
  if (field === "drive") {
    if (gv === tv) return "correct";
    if ((gv === "AWD" && tv === "4WD") || (gv === "4WD" && tv === "AWD")) return "close";
    return "wrong";
  }
  if (field === "make") {
    if (gv === tv) return "correct";
    const gf = MAKE_FAMILY[gv], tf = MAKE_FAMILY[tv];
    if (gf && tf && gf === tf) return "close";
    return "wrong";
  }
  return gv === tv ? "correct" : "wrong";
}
function yearArrow(gy, ty) { return gy < ty ? " ↑" : gy > ty ? " ↓" : ""; }
function hpArrow(gh, th) { return gh < th ? " ↑" : gh > th ? " ↓" : ""; }

// Search label = "Make Model (Year)" — used for display and search
const carLabel = c => `${c.make} ${c.model}`;
const carSearchStr = c => `${c.make} ${c.model}`.toLowerCase();
const ALL_CARS_INDEXED = CARS.map((c, i) => ({ ...c, idx: i, label: carLabel(c), search: carSearchStr(c) }));

// Car difficulty tiers: 1=everyone knows, 2=car people, 3=reasonably known, 4=deep cuts (half freq), 5=never daily
const CAR_TIERS = [2,1,2,3,3,3,3,3,3,2,2,2,2,1,3,1,1,4,4,4,3,3,1,1,2,3,4,4,1,3,1,1,1,4,1,3,2,4,3,2,2,2,1,2,1,2,2,2,2,2,3,4,4,3,3,3,1,1,2,4,4,3,4,4,2,2,2,2,2,2,2,1,2,2,3,4,4,3,3,4,1,4,3,1,3,3,1,1,2,2,2,2,2,4,2,2,2,1,3,4,3,3,3,3,1,3,4,2,2,1,2,1,2,3,3,3,3,3,4,1,3,2,2,2,2,2,2,4,2,2,4,3,2,3,3,3,3,3,3,3,4,3,3,2,2,3,2,2,2,4,4,3,3,3,4,3,3,3,4,4,3,3,2,2,1,1,4,3,3,2,3,3,3,2,2,3,1,1,1,3,3,2,2,3,2,2,2,2,2,2,2,1,3,3,2,2,2,1,3,2,3,3,1,1,1,3,2,3,3,4,3,2,4,2,3,3,2,2,2,2,2,1,2,1,3,3,3,3,3,3,1,3,4,3,4,1,4,3,3,2,1,1,3,1,2,3,1,3,2,3,4,4,4,2,2,2,2,1,2,2,3,2,3,3,1,3,3,4,1,3,4,4,4,1,2,2,2,2,1,1,2,1,2,3,3,1,2,1,1,1,3,4,3,3,3,3,3,1,1,1,3,3,3,2,2,2,2,2,2,1,1,1,2,2,2,2,1,2,3,3,3,3,1,1,1,3,3,1,1,3,3,2,2,1,1,2,1,2,2,3,2,3,1,3,2,2,2,3,3,2,2,2,3,3,3,3,2,2,2,2,1,3,1,3,2,3,3,2,2,1,2,2,4,1,1,3,1,3,1,2,4,3,3,3,4,3,1,4,3,4,4,1,2,1,1,1,2,1,1,1,1,3,2,1,2,2,1,1,2,2,3,3,4,4,2,3,3,3,3,3,1,1,1,1,3,3,3,4,2,2,2,2,2,2,2,1,2,2,1,2,1,1,4,4,3,3,3,3,3,3,3,4,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,2,2,2,2,2,3,3,3,3,3,3,3,5,2,2,1,2,2,4,4,3,1,3,2,3,1,2,2,2,3,2,1,3,2,2,1,3,2,3,3,1,3,3,1,2,2,1,3,2,2,2,2,3,2,3,3,3,3,3,3,2,1,2,2,2,4,3,3,4,1,3,1,4,3,3,3,3,2,2,4,4,2,1,2,2,2,2,2,2,3,3,3,3,2,2,2,4,3,2,3,2,4,5,2,2,3,3,2,4,1,4,2,2,2,2,2,3,1,4,2,3,4,4,2,1,3,3,3,1,1,3,1,1,3,3,3,1,1,3,1,1,5,2,2,4,4,4,4,4,4,2,4,4,4,4,4,4,4,2,4,5,1,4,4,4,4,4,1,3,2,2,2,4,4,4,5,2,4,3,5,5,5,5,3,3,3,3,3,3,4,4,3,4,1,3,4,4,4,3,4,3,3,3,3,3,3,3,1,4,4,1,1,4,2,1,4,4,1,3,4,3,4,2,2,4,4,3,3,3,4,4,4,3,4,3,3,3,3,4,4,3,4,4,4,3,3,3,3,3,2,4,4,4,3,3,3,2,2,3,3,3,3,3,3,3,3,1,2,4,4,4,4,3,4,4,3,4,3,3,3,3,3,2,3,4,4,2,2,3,3,1,3,3,4,1,1,3,3,3,3,3,3,3,3,4,3,3,4,3,4,3,4,3,3,4,4,4,3,4,3,4,3,3,3,4,3,4,4,3,1,1,1,3,3,2,4,5,4,4,4,3,4,4,2,4,2,4,3,3,3,3,3,4,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,3,3,3,3,3,4,3,3,4,4,4,3,1,4,2,2,2,4,5,5,3,3,3,3,3,3,3,4,4,3,3,4,4,3,3,3,3,1,2,4,4,4,1,3,3,3,3,4,3,3,3,4,4,4,4,4,4,4,5,5,4,4,4,4,4,4,5,4,4,4,5,3,5,4,4,5,2,4,4,4,4,4,5,3,3,5,3,5,4,2,4,2,4,4,4,4,4,4,3,3,1,4,4,3,4,4,4,3,4,3,1,1,3,4,4,3,4,4,4,3,2,2,3,2,2,2,4,4,3,3,3,3,3,4,2,4,3,3,3,4,2,4,3,4,4,4,4,4,4,4,5,3,3,3,4,2,3,4,2,3,2,4,4,4,2,3,3,3,3,2,3,3,3,3,2,3,2,1,2,3,1,1,2,1,1,1,3,4,3,3,1,3,2,4,3,3,3,4,3,4,4,3,3,3,3,3,2,3,3,3,3,3,3,4,3,4,3,3,4,2,3,3,3,2,3,4,4,4,4,4,3,4,3,3,3,3,3,3,1,3,3,3,3,3,3,3,1,2,2,4,3,4,3,3,4,3,4,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,3,2,4,3,3,3,3,3,3,2,2,3,4,3,2];

// Weighted daily pool: T1-3 get 2 entries (normal), T4 gets 1 (half likely), T5 excluded
const DAILY_POOL = [];
CARS.forEach((_,i) => {
  const t = CAR_TIERS[i] || 3;
  if (t <= 3) { DAILY_POOL.push(i); DAILY_POOL.push(i); }
  else if (t === 4) { DAILY_POOL.push(i); }
});

// Tutorial pool: tier 1 only
const TUTORIAL_POOL = CARS.map((_,i) => i).filter(i => CAR_TIERS[i] === 1);


/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
export default function Blindspot() {
  const [mode, setMode] = useState("menu");
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [search, setSearch] = useState("");
  const [dropOpen, setDropOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [revealRow, setRevealRow] = useState(-1);
  const [stats, setStats] = useState({ played:0,wins:0,streak:0,maxStreak:0,dist:Array(MAX_GUESSES).fill(0) });
  const [loaded, setLoaded] = useState(false);
  const [freeTarget, setFreeTarget] = useState(null);
  const [freeUsed, setFreeUsed] = useState(new Set());
  const [hlIdx, setHlIdx] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isTutorialRound, setIsTutorialRound] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [themePref, setThemePref] = useState("system"); // "system" | "dark" | "light"
  const [colorBlind, setColorBlind] = useState(false);
  const [systemDark, setSystemDark] = useState(true);
  const inputRef = useRef(null);
  const dropRef = useRef(null);
  const gridEndRef = useRef(null);
  const gridScrollRef = useRef(null);

  const dayNum = useMemo(() => getDayNumber(), []);
  const [dailyCarIdx, setDailyCarIdx] = useState(() => resolveDailyCarIndex());
  const [tutorialIdx] = useState(() => TUTORIAL_POOL[Math.floor(Math.random() * TUTORIAL_POOL.length)]);
  const tutorialCar = CARS[tutorialIdx];
  const dailyTarget = CARS[dailyCarIdx];
  const target = mode === "freeplay" ? freeTarget : dailyTarget;

  /* ── GOOGLE SHEET FETCH (production only) ── */
  useEffect(() => {
    if (SHEET_URL) {
      fetchSheetSchedule().then(idx => {
        if (idx !== null) setDailyCarIdx(idx);
      });
    }
  }, []);

  /* ── PERSISTENCE ── */
  useEffect(() => {
    (async () => {
      try { const r = localStorage.getItem("bs-s2"); if(r) setStats(JSON.parse(r)); } catch {}
      try {
        const r = localStorage.getItem("bs-d2");
        if (r) {
          const s = JSON.parse(r);
          if (s.day === dayNum) {
            const gs = s.guessIdx.map(i => CARS[i]).filter(Boolean);
            setGuesses(gs); setGameOver(s.go); setWon(s.w); setRevealRow(gs.length-1);
          }
        }
      } catch {}
      try { const hp = localStorage.getItem("bs-played"); if(!hp) setShowTutorial(true); } catch { setShowTutorial(true); }
      setLoaded(true);
    })();
  }, [dayNum]);

  const persist = useCallback((gIdx, go, w) => {
    if (mode !== "daily" || !loaded) return;
    try { localStorage.setItem("bs-d2", JSON.stringify({day:dayNum,guessIdx:gIdx,go,w})); } catch {}
  }, [mode, loaded, dayNum]);

  useEffect(() => {
    if (loaded) try { localStorage.setItem("bs-s2", JSON.stringify(stats)); } catch {}
  }, [stats, loaded]);

  /* ── SETTINGS PERSISTENCE ── */
  useEffect(() => {
    (async () => {
      try {
        const r = localStorage.getItem("bs-prefs");
        if (r) {
          const p = JSON.parse(r);
          if (p.theme) setThemePref(p.theme);
          if (p.colorBlind) setColorBlind(p.colorBlind);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (loaded) try { localStorage.setItem("bs-prefs", JSON.stringify({ theme: themePref, colorBlind })); } catch {}
  }, [themePref, colorBlind, loaded]);

  /* ── SYSTEM THEME DETECTION ── */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const handler = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isDark = themePref === "system" ? systemDark : themePref === "dark";

  /* ── FREE PLAY ── */
  const nextFreePlay = useCallback(() => {
    let idx, att = 0;
    do { idx = Math.floor(Math.random() * CARS.length); att++; } while (freeUsed.has(idx) && att < CARS.length);
    setFreeTarget(CARS[idx]); setFreeUsed(p => new Set([...p, idx]));
    setGuesses([]); setGameOver(false); setWon(false); setRevealRow(-1); setSearch(""); setHlIdx(0);
  }, [freeUsed]);

  /* ── FILTER — only on type ── */
  const guessedIdxSet = useMemo(() => new Set(guesses.map(g => CARS.indexOf(g))), [guesses]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return ALL_CARS_INDEXED.filter(c => c.search.includes(q) && !guessedIdxSet.has(c.idx)).slice(0, 25);
  }, [search, guessedIdxSet]);

  /* ── SUBMIT ── */
  const submitGuess = useCallback((carIdx) => {
    if (guessedIdxSet.has(carIdx) || gameOver || !target) return;
    const car = CARS[carIdx];
    const newG = [...guesses, car];
    const newIdx = [...guesses.map(g => CARS.indexOf(g)), carIdx];
    setGuesses(newG); setRevealRow(newG.length-1); setSearch(""); setDropOpen(false); setHlIdx(0);

    const correct = car.make === target.make && car.model === target.model;
    if (correct) {
      setWon(true); setGameOver(true);
      if (mode === "daily") {
        setStats(p => {
          const n = {...p,played:p.played+1,wins:p.wins+1,streak:p.streak+1,maxStreak:Math.max(p.maxStreak,p.streak+1),dist:[...p.dist]};
          n.dist[newG.length-1]++;
          return n;
        });
      }
      persist(newIdx, true, true);
    } else if (newG.length >= MAX_GUESSES) {
      setGameOver(true);
      if (mode === "daily") setStats(p => ({...p,played:p.played+1,streak:0,dist:[...p.dist]}));
      persist(newIdx, true, false);
    } else { persist(newIdx, false, false); }
    setTimeout(() => {
      if (gridScrollRef.current) gridScrollRef.current.scrollTop = gridScrollRef.current.scrollHeight;
    }, 80);
    setTimeout(() => {
      if (gridScrollRef.current) gridScrollRef.current.scrollTop = gridScrollRef.current.scrollHeight;
    }, 450);
  }, [guesses, target, gameOver, guessedIdxSet, mode, persist]);

  /* ── KEYBOARD NAV ── */
  const handleKeyDown = useCallback((e) => {
    if (!dropOpen || filtered.length === 0) {
      if (e.key === "Enter" && filtered.length === 1) submitGuess(filtered[0].idx);
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setHlIdx(i => Math.min(i+1, filtered.length-1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHlIdx(i => Math.max(i-1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if(filtered[hlIdx]) submitGuess(filtered[hlIdx].idx); }
  }, [dropOpen, filtered, hlIdx, submitGuess]);

  /* ── SHARE ── */
  const shareText = useMemo(() => {
    if (!gameOver || !target) return "";
    const em = {correct:"🟩",close:"🟨",wrong:"⬛"};
    const rows = guesses.map(g => COLS.map(c => em[compareField(g[c], target[c], c)]).join(""));
    return `🏎️ BLINDSPOT ${mode==="daily"?`#${dayNum}`:"Free Play"} — ${won?guesses.length:"X"}/${MAX_GUESSES}\n\n${rows.join("\n")}\n\nCan you beat me? 🏁`;
  }, [gameOver, guesses, target, dayNum, won, mode]);

  const doShare = async () => {
    try { if(navigator.share) await navigator.share({text:shareText}); else throw 0; }
    catch { try { await navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(()=>setCopied(false),2000); } catch {} }
  };

  /* ── AUTO-SCROLL GRID ON NEW GUESS ── */
  useEffect(() => {
    if (guesses.length > 0 && gridScrollRef.current) {
      const el = gridScrollRef.current;
      requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
      setTimeout(() => { el.scrollTop = el.scrollHeight; }, 400);
    }
  }, [guesses.length]);

  /* ── OUTSIDE CLICK ── */
  useEffect(() => {
    const h = e => { if(dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown",h); document.addEventListener("touchstart",h);
    return () => { document.removeEventListener("mousedown",h); document.removeEventListener("touchstart",h); };
  }, []);

  const completeTutorial = () => { setShowTutorial(false); try { localStorage.setItem("bs-played","1"); } catch {} };
  const startDaily = () => { setMode("daily"); setShowHelp(false); setShowSettings(false); setShowSchedule(false); };
  const startFree = (tutorial) => {
    setMode("freeplay");
    setIsTutorialRound(!!tutorial);
    if (tutorial) {
      const idx = TUTORIAL_POOL[Math.floor(Math.random() * TUTORIAL_POOL.length)];
      setFreeTarget(CARS[idx]);
      setGuesses([]); setGameOver(false); setWon(false); setRevealRow(-1); setSearch(""); setHlIdx(0);
    } else {
      nextFreePlay();
    }
    setShowHelp(false); setShowSettings(false); setShowSchedule(false);
  };
  const goMenu = () => { setMode("menu"); setGuesses([]); setGameOver(false); setWon(false); setRevealRow(-1); setSearch(""); setShowHelp(false); setShowSettings(false); setShowSchedule(false); };

  // Generate upcoming 30-day schedule preview
  const schedulePreview = useMemo(() => {
    const days = [];
    const launch = new Date(LAUNCH_EPOCH.getFullYear(), LAUNCH_EPOCH.getMonth(), LAUNCH_EPOCH.getDate());
    for (let d = 0; d < 30; d++) {
      const dt = new Date();
      dt.setDate(dt.getDate() + d);
      const dn = Math.floor((new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()) - launch) / 86400000) + 1;
      const mm = String(dt.getMonth()+1).padStart(2,"0");
      const dd = String(dt.getDate()).padStart(2,"0");
      const mmdd = `${mm}-${dd}`;
      const dateStr = dt.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
      
      let car, source = "algo", note = "";
      const annualEntry = ANNUAL_SCHEDULE[mmdd];
      if (annualEntry) {
        const idx = findCar(annualEntry.make, annualEntry.model);
        if (idx !== null) { car = CARS[idx]; source = "easter"; note = annualEntry.note; }
      }
      if (!car) {
        const algoIdx = (((dn * 2654435761) >>> 0) % CARS.length);
        car = CARS[algoIdx];
      }
      days.push({ dateStr, dayNum: dn, car, source, note, isToday: d === 0 });
    }
    return days;
  }, []);

  /* ═══════════ COLORS ═══════════ */
  const C = isDark ? {
    bg:"#08080A",s:"#111114",s2:"#18181C",bd:"#222228",
    acc:"#FF3D00",ag:"rgba(255,61,0,0.25)",
    g:"#00E676",y:"#FFD740",
    dim:"#555560",dimr:"#333340",
    t:"#EEEEF0",tm:"#AAAAB0",td:"#66666E",
    cellWrong:"#18181C",cellWrongFg:"#66666E",cellWrongBd:"1px solid #222228",
    correctFg:"#000",closeFg:"#000",
  } : {
    bg:"#F4F4F6",s:"#FFFFFF",s2:"#EEEEF2",bd:"#D4D4DA",
    acc:"#D62800",ag:"rgba(214,40,0,0.15)",
    g:"#00A856",y:"#E5A800",
    dim:"#8E8E96",dimr:"#C4C4CC",
    t:"#1A1A1E",tm:"#4A4A52",td:"#7A7A84",
    cellWrong:"#E6E6EC",cellWrongFg:"#7A7A84",cellWrongBd:"1px solid #D4D4DA",
    correctFg:"#FFF",closeFg:"#1A1A1E",
  };

  // Colorblind-friendly symbols
  const cbSymbol = { correct:"✓", close:"~", wrong:"✗" };

  return (
    <div style={{minHeight:"100dvh",background:C.bg,color:C.t,fontFamily:"'Barlow',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",WebkitTapHighlightColor:"transparent",userSelect:"none"}}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${C.bg};overflow-x:hidden;transition:background 0.3s ease}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cellFlip{0%{transform:rotateX(90deg);opacity:0}60%{transform:rotateX(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}
        @keyframes glow{0%,100%{box-shadow:0 0 16px ${C.ag}}50%{box-shadow:0 0 28px ${C.ag}}}
        @keyframes subtlePulse{0%,100%{opacity:1}50%{opacity:0.85}}
        .cf{animation:cellFlip 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards;transform-origin:center;opacity:0}
        .re{animation:fadeUp 0.3s cubic-bezier(0.25,0.46,0.45,0.94) forwards}
        input::placeholder{color:${C.dimr}}
        input:focus{border-color:${C.acc}!important;box-shadow:0 0 0 3px ${C.ag}!important;transition:all 0.2s ease}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${C.dimr};border-radius:99px}
        .di{transition:background 0.15s ease}.di:active{background:${C.s2}!important}
        .pill{border:none;cursor:pointer;font-family:'Barlow',sans-serif;font-weight:600;
          transition:transform 0.15s cubic-bezier(0.25,0.46,0.45,0.94),opacity 0.15s,box-shadow 0.2s}
        .pill:active{transform:scale(0.96)!important;opacity:0.9}
        .pill:hover{opacity:0.95}
        .mc{transition:transform 0.15s cubic-bezier(0.25,0.46,0.45,0.94),box-shadow 0.2s;cursor:pointer}
        .mc:active{transform:scale(0.98)!important}
        .mc:hover{box-shadow:0 2px 12px rgba(0,0,0,0.15)}
        .icon-btn{display:flex;align-items:center;justify-content:center;cursor:pointer;
          transition:background 0.15s,transform 0.1s;border-radius:99px}
        .icon-btn:active{transform:scale(0.92)}
      `}</style>

      {/* ═══ MENU ═══ */}
      {mode==="menu" && (
        <div style={{width:"100%",maxWidth:420,padding:"0 20px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100dvh"}}>
          <div style={{textAlign:"center",marginBottom:36,animation:"fadeUp 0.5s ease"}}>
            <div style={{fontSize:12,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:6,color:C.dim,fontWeight:600,marginBottom:2}}>THE DAILY</div>
            <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:64,letterSpacing:8,color:C.acc,lineHeight:0.9,textShadow:`0 0 40px ${C.ag}`}}>BLINDSPOT</h1>
            <div style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:C.td,marginTop:8,letterSpacing:1}}>{CARS.length} CARS • 8 GUESSES • NO HINTS</div>
          </div>
          <div style={{display:"flex",gap:20,marginBottom:32,animation:"fadeUp 0.5s ease 0.1s",animationFillMode:"backwards"}}>
            {[{l:"PLAYED",v:stats.played},{l:"WIN %",v:stats.played?Math.round(stats.wins/stats.played*100):0},{l:"STREAK",v:stats.streak},{l:"BEST",v:stats.maxStreak}].map(s=>(
              <div key={s.l} style={{textAlign:"center"}}><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:C.t}}>{s.v}</div><div style={{fontSize:9,color:C.dim,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,fontWeight:600}}>{s.l}</div></div>
            ))}
          </div>
          <div style={{width:"100%",display:"flex",flexDirection:"column",gap:10}}>
            {/* Tutorial card — first time only */}
            {showTutorial && (
              <div className="mc" onClick={() => startFree(true)} style={{background:`linear-gradient(135deg,${C.s},${C.ag})`,border:`2px solid ${C.acc}`,borderRadius:16,padding:"20px 20px",cursor:"pointer",animation:"fadeUp 0.5s ease 0.15s",animationFillMode:"backwards",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:3,color:C.acc}}>WELCOME!</div>
                  <div style={{fontSize:13,color:C.tm,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:0.5,marginTop:3}}>First time? Try a quick practice round to learn how it works.</div>
                </div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,color:C.acc,background:C.s,padding:"8px 16px",borderRadius:99,border:`1px solid ${C.acc}`,flexShrink:0,marginLeft:12}}>PLAY</div>
              </div>
            )}
            <div className="mc" onClick={startDaily} style={{background:C.s,border:`1px solid ${C.bd}`,borderRadius:16,padding:"18px 20px",cursor:"pointer",animation:"fadeUp 0.5s ease 0.2s",animationFillMode:"backwards",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:3}}>DAILY PUZZLE</div><div style={{fontSize:12,color:C.td,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,marginTop:3}}>{gameOver?(won?`✓ SOLVED IN ${guesses.length}`:"COMPLETED"):`PUZZLE #${dayNum}`}</div></div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,color:C.acc}}>#{dayNum}</div>
            </div>
            <div className="mc" onClick={() => startFree(false)} style={{background:C.s,border:`1px solid ${C.bd}`,borderRadius:16,padding:"18px 20px",cursor:"pointer",animation:"fadeUp 0.5s ease 0.3s",animationFillMode:"backwards",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:3}}>FREE PLAY</div><div style={{fontSize:12,color:C.td,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,marginTop:3}}>UNLIMITED • PRACTICE</div></div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:C.y,background:"rgba(255,215,64,0.08)",padding:"6px 14px",borderRadius:99,border:"1px solid rgba(255,215,64,0.15)"}}>∞</div>
            </div>
            <div style={{background:`linear-gradient(135deg,${C.s},rgba(255,61,0,0.04))`,border:`1px solid ${C.bd}`,borderRadius:16,padding:"18px 20px",animation:"fadeUp 0.5s ease 0.4s",animationFillMode:"backwards",opacity:0.5}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:3,color:C.tm}}>BLINDSPOT PRO</div><div style={{fontSize:10,color:C.td,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,marginTop:2}}>STREAK SHIELDS • HINTS • NO ADS</div></div>
                <div style={{fontSize:10,color:C.dim,fontFamily:"'DM Mono',monospace",background:C.s2,padding:"5px 10px",borderRadius:4}}>SOON</div>
              </div>
            </div>
          </div>

          {/* How to Play toggle */}
          <div onClick={() => setShowHelp(!showHelp)} style={{marginTop:20,cursor:"pointer",fontSize:11,color:C.tm,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,fontWeight:600,animation:"fadeUp 0.5s ease 0.5s",animationFillMode:"backwards",display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:14,color:C.dim}}>{showHelp?"▾":"▸"}</span> HOW TO PLAY
          </div>

          {showHelp && (
            <div style={{width:"100%",marginTop:12,background:C.s,border:`1px solid ${C.bd}`,borderRadius:16,padding:"16px 18px",animation:"fadeUp 0.25s ease",fontSize:13,color:C.tm,lineHeight:1.6}}>
              <p style={{marginBottom:12}}>Guess the mystery car in <span style={{color:C.t,fontWeight:700}}>8 tries</span>. Type a car name to search, then select your guess.</p>

              <p style={{marginBottom:10,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,color:C.dim,fontWeight:600}}>AFTER EACH GUESS</p>
              <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:28,height:28,borderRadius:4,background:C.g,flexShrink:0}}/>
                  <span><span style={{color:C.t,fontWeight:600}}>Green</span> — exact match</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:28,height:28,borderRadius:4,background:C.y,flexShrink:0}}/>
                  <span><span style={{color:C.t,fontWeight:600}}>Yellow</span> — close (see below)</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:28,height:28,borderRadius:4,background:C.s2,border:`1px solid ${C.bd}`,flexShrink:0}}/>
                  <span><span style={{color:C.t,fontWeight:600}}>Gray</span> — no match</span>
                </div>
              </div>

              <p style={{marginBottom:10,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,color:C.dim,fontWeight:600}}>WHAT COUNTS AS "CLOSE"</p>
              <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:14,fontSize:12,color:C.td}}>
                <span>• <span style={{color:C.tm}}>Make</span> — same family (e.g. Lexus & Toyota, Infiniti & Nissan)</span>
                <span>• <span style={{color:C.tm}}>Year</span> — within 5 years (arrows show direction)</span>
                <span>• <span style={{color:C.tm}}>HP</span> — within 50 hp (arrows show direction)</span>
                <span>• <span style={{color:C.tm}}>Country</span> — same continent (e.g. Japan & South Korea)</span>
                <span>• <span style={{color:C.tm}}>Drive</span> — AWD and 4WD are considered close</span>
              </div>

              <p style={{marginBottom:10,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:2,color:C.dim,fontWeight:600}}>GOOD TO KNOW</p>
              <div style={{display:"flex",flexDirection:"column",gap:4,fontSize:12,color:C.td}}>
                <span>• Each car is tagged with its <span style={{color:C.tm}}>primary body style</span></span>
                <span>• Motor is always exact — green or gray</span>
                <span>• A new daily puzzle drops every midnight</span>
              </div>
            </div>
          )}

          <div style={{marginTop:showHelp?16:28,fontSize:10,color:C.dimr,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>NEW PUZZLE EVERY MIDNIGHT</div>

          {/* Settings toggle */}
          <div onClick={() => setShowSettings(!showSettings)} style={{marginTop:16,cursor:"pointer",fontSize:11,color:C.tm,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:14,color:C.dim}}>⚙</span> SETTINGS
          </div>

          {showSettings && (
            <div style={{width:"100%",marginTop:12,background:C.s,border:`1px solid ${C.bd}`,borderRadius:16,padding:"16px 18px",animation:"fadeUp 0.25s ease"}}>

              {/* Theme */}
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,color:C.dim,fontWeight:600,marginBottom:10}}>THEME</div>
                <div style={{display:"flex",gap:6}}>
                  {[["system","System"],["dark","Dark"],["light","Light"]].map(([val,label]) => (
                    <div key={val} onClick={() => setThemePref(val)} style={{
                      flex:1,padding:"10px 0",borderRadius:99,textAlign:"center",cursor:"pointer",
                      fontSize:12,fontWeight:600,fontFamily:"'Barlow',sans-serif",
                      background:themePref===val?C.acc:C.s2,
                      color:themePref===val?(isDark?"#000":"#FFF"):C.tm,
                      border:`1px solid ${themePref===val?"transparent":C.bd}`,
                      transition:"all 0.2s"
                    }}>{label}</div>
                  ))}
                </div>
              </div>

              {/* Colorblind mode */}
              <div style={{marginBottom:18}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:13,color:C.t,fontWeight:600}}>Colorblind Mode</div>
                    <div style={{fontSize:12,color:C.td,marginTop:3}}>Adds symbols (✓ ~ ✗) to cells</div>
                  </div>
                  <div onClick={() => setColorBlind(!colorBlind)} style={{
                    width:48,height:28,borderRadius:99,cursor:"pointer",
                    background:colorBlind?C.acc:C.s2,border:`1px solid ${colorBlind?"transparent":C.bd}`,
                    position:"relative",transition:"background 0.2s"
                  }}>
                    <div style={{
                      width:20,height:20,borderRadius:10,background:colorBlind?"#000":"#666",
                      position:"absolute",top:2,left:colorBlind?21:2,transition:"left 0.2s"
                    }}/>
                  </div>
                </div>
              </div>

              {/* Reset stats */}
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:13,color:C.t,fontWeight:600}}>Reset Statistics</div>
                    <div style={{fontSize:12,color:C.td,marginTop:3}}>Clear all stats and streaks</div>
                  </div>
                  <div onClick={() => {
                    if(window.confirm("Reset all stats? This can't be undone.")) {
                      setStats({played:0,wins:0,streak:0,maxStreak:0,dist:Array(MAX_GUESSES).fill(0)});
                    }
                  }} style={{
                    padding:"8px 18px",borderRadius:99,cursor:"pointer",
                    fontSize:11,fontWeight:600,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,
                    color:"#FF4444",border:"1px solid rgba(255,68,68,0.3)",background:"transparent"
                  }}>RESET</div>
                </div>
              </div>

              {/* Schedule viewer link */}
              <div style={{marginTop:18,paddingTop:14,borderTop:`1px solid ${C.bd}`}}>
                <div onClick={() => setShowSchedule(true)} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                  <span style={{fontSize:14}}>📅</span>
                  <span style={{fontSize:12,color:C.td}}>Upcoming schedule</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ SCHEDULE VIEWER ═══ */}
      {showSchedule && (
        <div style={{position:"fixed",inset:0,background:C.bg,zIndex:100,display:"flex",flexDirection:"column",overflowY:"auto"}}>
          <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.bd}`,flexShrink:0}}>
            <div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:3,color:C.acc}}>SCHEDULE</div>
              <div style={{fontSize:11,color:C.td,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1}}>NEXT 30 DAYS</div>
            </div>
            <div className="icon-btn" onClick={() => setShowSchedule(false)} style={{width:38,height:38,fontSize:16,color:C.dim,background:C.s}}>✕</div>
          </div>
          <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:2}}>
            {schedulePreview.map((day, i) => (
              <div key={i} style={{
                display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"10px 14px",borderRadius:10,
                background:day.isToday?C.s2:day.source==="easter"?`${C.acc}11`:"transparent",
                border:day.isToday?`1px solid ${C.acc}`:`1px solid transparent`
              }}>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:12,color:day.isToday?C.acc:C.tm,fontWeight:600,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:0.5,minWidth:85}}>{day.dateStr}</span>
                    <span style={{fontSize:11,color:C.dimr,fontFamily:"'DM Mono',monospace"}}>#{day.dayNum}</span>
                    {day.source==="easter" && <span style={{fontSize:9,padding:"2px 6px",borderRadius:99,background:C.acc,color:"#FFF",fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1}}>EVENT</span>}
                  </div>
                  <div style={{fontSize:13,color:C.t,fontWeight:600,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{day.car.make} {day.car.model}</div>
                  {day.note && <div style={{fontSize:10,color:C.td,marginTop:1}}>{day.note}</div>}
                </div>
                <div style={{fontSize:11,color:C.dim,fontFamily:"'DM Mono',monospace",flexShrink:0,marginLeft:8}}>{day.car.hp}hp</div>
              </div>
            ))}
          </div>
          <div style={{padding:"16px",textAlign:"center",fontSize:10,color:C.dimr,fontFamily:"'DM Mono',monospace"}}>
            SCHEDULE PREVIEW • FOR YOUR EYES ONLY
          </div>
        </div>
      )}

      {/* ═══ GAME ═══ */}
      {(mode==="daily"||mode==="freeplay") && target && (
        <div style={{width:"100%",maxWidth:500,display:"flex",flexDirection:"column",minHeight:"100dvh"}}>
          {/* Header */}
          <header style={{padding:"14px 14px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.bd}`,flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div className="icon-btn" onClick={goMenu} style={{width:38,height:38,fontSize:18,color:C.dim,background:C.s}}>←</div>
              <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:3,color:C.acc,lineHeight:1}}>BLINDSPOT</h1>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              {mode==="freeplay" && <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:C.y,background:"rgba(255,215,64,0.08)",padding:"5px 12px",borderRadius:99}}>FREE PLAY</div>}
              {mode==="daily" && <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:C.t}}>#{dayNum}</div>}
              <div className="icon-btn" onClick={() => setShowSettings(!showSettings)} style={{width:38,height:38,fontSize:15,color:C.dim,background:C.s}}>⚙</div>
              <div className="icon-btn" onClick={() => setShowHelp(!showHelp)} style={{width:38,height:38,fontSize:15,color:C.dim,background:C.s,fontWeight:700}}>?</div>
            </div>
          </header>

          {/* In-game settings panel */}
          {showSettings && (
            <div style={{padding:"12px 14px",borderBottom:`1px solid ${C.bd}`,background:C.s,animation:"fadeUp 0.2s ease",flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:2,color:C.dim,fontWeight:600}}>SETTINGS</span>
                <span onClick={() => setShowSettings(false)} style={{cursor:"pointer",fontSize:11,color:C.dim,fontFamily:"'DM Mono',monospace"}}>✕</span>
              </div>
              <div style={{display:"flex",gap:6,marginBottom:12}}>
                {[["system","System"],["dark","Dark"],["light","Light"]].map(([val,label]) => (
                  <div key={val} onClick={() => setThemePref(val)} style={{
                    flex:1,padding:"10px 0",borderRadius:99,textAlign:"center",cursor:"pointer",
                    fontSize:11,fontWeight:600,
                    background:themePref===val?C.acc:C.s2,
                    color:themePref===val?(isDark?"#000":"#FFF"):C.tm,
                    border:`1px solid ${themePref===val?"transparent":C.bd}`,
                    transition:"all 0.2s"
                  }}>{label}</div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,color:C.tm}}>Colorblind Mode</span>
                <div onClick={() => setColorBlind(!colorBlind)} style={{
                  width:44,height:26,borderRadius:99,cursor:"pointer",
                  background:colorBlind?C.acc:C.s2,border:`1px solid ${colorBlind?"transparent":C.bd}`,
                  position:"relative",transition:"background 0.2s"
                }}>
                  <div style={{width:20,height:20,borderRadius:99,background:colorBlind?"#000":"#666",position:"absolute",top:2,left:colorBlind?21:2,transition:"left 0.25s cubic-bezier(0.34,1.56,0.64,1)"}}/>
                </div>
              </div>
              <div onClick={() => { setShowSettings(false); setShowSchedule(true); }} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginTop:12,paddingTop:10,borderTop:`1px solid ${C.bd}`}}>
                <span style={{fontSize:13}}>📅</span>
                <span style={{fontSize:11,color:C.td}}>Upcoming schedule</span>
              </div>
            </div>
          )}

          {/* In-game help panel */}
          {showHelp && (
            <div style={{padding:"12px 14px",borderBottom:`1px solid ${C.bd}`,background:C.s,animation:"fadeUp 0.2s ease",flexShrink:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:2,color:C.dim,fontWeight:600}}>HOW TO PLAY</span>
                <span onClick={() => setShowHelp(false)} style={{cursor:"pointer",fontSize:11,color:C.dim,fontFamily:"'DM Mono',monospace"}}>✕</span>
              </div>
              <div style={{fontSize:13,color:C.td,lineHeight:1.7,display:"flex",flexDirection:"column",gap:4}}>
                <span>Guess the car in <span style={{color:C.t,fontWeight:600}}>8 tries</span>. After each guess:</span>
                <span>🟩 <span style={{color:C.g}}>Green</span> = exact match</span>
                <span>🟨 <span style={{color:C.y}}>Yellow</span> = close — related makes, year ±5yrs, HP ±50, same continent, AWD↔4WD</span>
                <span>⬛ <span style={{color:C.tm}}>Gray</span> = no match</span>
                <span style={{marginTop:4,color:C.dimr}}>Each car is tagged with its primary body style. Year arrows show if the answer is earlier ↓ or later ↑.</span>
              </div>
            </div>
          )}

          {/* Column headers */}
          <div style={{padding:"10px 10px 4px",display:"grid",gridTemplateColumns:"1fr 0.6fr 0.5fr 0.65fr 0.55fr 0.65fr 0.55fr",gap:3,flexShrink:0}}>
            {COL_LABELS.map(l => <div key={l} style={{textAlign:"center",fontSize:10,color:C.dimr,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1.5,fontWeight:700}}>{l}</div>)}
          </div>

          {/* Grid */}
          <div ref={gridScrollRef} style={{padding:"0 10px",display:"flex",flexDirection:"column",gap:8,flex:"1 1 auto",overflowY:"auto",minHeight:0,WebkitOverflowScrolling:"touch",scrollBehavior:"smooth"}}>
            {guesses.map((guess, rowIdx) => {
              const revealing = rowIdx === revealRow;
              const isCorrect = guess.make === target.make && guess.model === target.model;
              return (
                <div key={rowIdx} className="re" style={{display:"flex",flexDirection:"column",gap:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,paddingLeft:2,minHeight:18}}>
                    <span style={{fontSize:10,color:C.dimr,fontFamily:"'DM Mono',monospace",minWidth:16}}>{rowIdx+1}.</span>
                    <span style={{fontSize:11,color:isCorrect?C.g:C.tm,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:0.5,fontWeight:isCorrect?700:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1}}>{guess.make} {guess.model}</span>
                    <span style={{fontSize:10,color:C.dimr,fontFamily:"'DM Mono',monospace",flexShrink:0}}>{guess.spanStart===guess.spanEnd?guess.spanStart:`${guess.spanStart}–${guess.spanEnd}`}</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 0.6fr 0.5fr 0.65fr 0.55fr 0.65fr 0.55fr",gap:3}}>
                  {COLS.map((col, ci) => {
                    const res = compareField(guess[col], target[col], col);
                    const bg = res==="correct"?C.g:res==="close"?C.y:C.cellWrong;
                    const fg = res==="correct"?C.correctFg:res==="close"?C.closeFg:C.cellWrongFg;
                    const bd = res==="wrong"?C.cellWrongBd:"1px solid transparent";
                    let txt = String(guess[col]);
                    if (col==="year") txt += yearArrow(guess.year, target.year);
                    if (col==="hp") txt = guess.hp + hpArrow(guess.hp, target.hp);
                    if (col==="country") txt = FLAG_MAP[guess.countryCode] || txt;
                    const cbTag = colorBlind ? cbSymbol[res] : null;
                    return (
                      <div key={ci} className={revealing?"cf":""} style={{
                        animationDelay:revealing?`${ci*0.06}s`:"0s",opacity:revealing?0:1,
                        height:44,background:bg,borderRadius:8,border:bd,
                        display:"flex",alignItems:"center",justifyContent:"center",position:"relative",
                        fontSize:col==="country"?16:col==="make"?10:col==="hp"?11:11,
                        fontWeight:600,color:fg,padding:"0 2px",textAlign:"center",lineHeight:1.1,
                        overflow:"hidden",whiteSpace:"nowrap"
                      }}>
                        {txt}
                        {cbTag && <span style={{position:"absolute",top:1,right:3,fontSize:8,opacity:0.7}}>{cbTag}</span>}
                      </div>
                    );
                  })}
                  </div>
                </div>
              );
            })}
            {/* Next guess row indicator */}
            {!gameOver && guesses.length < MAX_GUESSES && (
              <div style={{display:"grid",gridTemplateColumns:"1fr 0.6fr 0.5fr 0.65fr 0.55fr 0.65fr 0.55fr",gap:3}}>
                {COLS.map((_,ci) => <div key={ci} style={{height:44,background:C.s,borderRadius:8,border:`1px solid ${C.bd}`,opacity:0.4}}/>)}
              </div>
            )}

            {/* Input — inside scroll area, always right below guesses */}
            {!gameOver && (
              <div ref={dropRef} style={{padding:"10px 0 6px",position:"relative",flexShrink:0}}>
                <input ref={inputRef} value={search}
                  onChange={e => { setSearch(e.target.value); setDropOpen(true); setHlIdx(0); }}
                  onFocus={() => { if(search.trim()) setDropOpen(true); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a car to guess..."
                  style={{width:"100%",height:54,background:C.s,border:`1.5px solid ${C.bd}`,borderRadius:99,color:C.t,fontSize:16,padding:"0 20px",outline:"none",fontFamily:"'Barlow',sans-serif",fontWeight:500,transition:"border-color 0.2s,box-shadow 0.2s"}}
                />
                {dropOpen && filtered.length > 0 && (
                  <div style={{position:"absolute",left:0,right:0,top:68,background:C.s,border:`1px solid ${C.bd}`,borderRadius:16,maxHeight:200,overflowY:"auto",zIndex:10,boxShadow:`0 8px 40px rgba(0,0,0,${isDark?0.6:0.12})`}}>
                    {filtered.map((c, i) => (
                      <div key={c.idx} className="di" onClick={() => submitGuess(c.idx)} style={{
                        padding:"14px 16px",fontSize:15,cursor:"pointer",borderBottom:`1px solid ${C.bd}`,
                        color:i===hlIdx?C.t:C.tm,fontWeight:500,background:i===hlIdx?C.s2:"transparent",
                        display:"flex",justifyContent:"space-between"
                      }}>
                        <span>{c.label}</span>
                        <span style={{fontSize:10,color:C.dim,fontFamily:"'DM Mono',monospace"}}>{c.spanStart===c.spanEnd?c.spanStart:`${c.spanStart}–${c.spanEnd}`}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{display:"flex",justifyContent:"center",gap:16,paddingTop:10,fontSize:11,color:C.dimr,fontFamily:"'DM Mono',monospace"}}>
                  <span>{guesses.length}/{MAX_GUESSES}</span><span style={{color:C.dim}}>•</span><span>{CARS.length} MODELS</span>
                </div>
              </div>
            )}

            <div ref={gridEndRef} style={{height:8,flexShrink:0}}/>
          </div>

          {/* Game over */}
          {gameOver && (
            <div style={{padding:"16px 14px 24px",borderTop:`1px solid ${C.bd}`,animation:"fadeUp 0.4s ease",textAlign:"center",flexShrink:0}}>
              {won ? (
                <><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,color:C.g,letterSpacing:4}}>
                  {guesses.length===1?"LEGENDARY":guesses.length===2?"UNREAL":guesses.length<=3?"INCREDIBLE":guesses.length<=4?"IMPRESSIVE":guesses.length<=5?"SOLID":guesses.length<=6?"NICE":guesses.length===7?"CLOSE CALL":"SPOTTED!"}
                </div><p style={{fontSize:12,color:C.td,marginTop:4,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1}}>{target.year} {target.make} {target.model} — {guesses.length}/{MAX_GUESSES}</p></>
              ) : (
                <><div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,color:C.acc,letterSpacing:4}}>STALLED OUT</div><p style={{fontSize:12,color:C.td,marginTop:4}}>It was the <span style={{color:C.t,fontWeight:700}}>{target.year} {target.make} {target.model}</span></p></>
              )}
              {mode==="daily" && (
                <div style={{margin:"14px auto 0",maxWidth:240}}>
                  {stats.dist.map((count,i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                      <span style={{fontSize:10,color:C.dim,width:16,textAlign:"right",fontWeight:700,fontFamily:"'DM Mono',monospace"}}>{i+1}</span>
                      <div style={{height:18,borderRadius:3,background:(won&&guesses.length===i+1)?C.g:C.s2,minWidth:18,width:`${Math.max(8,count/Math.max(1,...stats.dist)*100)}%`,display:"flex",alignItems:"center",justifyContent:"flex-end",padding:"0 5px",fontSize:10,fontWeight:700,color:(won&&guesses.length===i+1)?C.correctFg:C.dim,fontFamily:"'DM Mono',monospace",transition:"width 0.6s ease"}}>{count}</div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:16,flexWrap:"wrap"}}>
                {isTutorialRound ? (
                  <>
                    <div style={{width:"100%",textAlign:"center",marginBottom:8,fontSize:13,color:C.tm}}>
                      {won ? "Nice work! You're ready for the real thing." : "No worries — you'll get the hang of it!"}
                    </div>
                    <button className="pill" onClick={() => { completeTutorial(); goMenu(); }} style={{padding:"16px 36px",background:C.acc,color:"#FFF",fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:3,borderRadius:99,fontWeight:700,animation:"glow 2s ease infinite"}}>
                      TRY THE DAILY
                    </button>
                    <button className="pill" onClick={() => { completeTutorial(); startFree(false); }} style={{padding:"16px 28px",background:C.s,color:C.tm,fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2,border:`1px solid ${C.bd}`,borderRadius:99}}>
                      PRACTICE MORE
                    </button>
                  </>
                ) : (
                  <>
                    <button className="pill" onClick={doShare} style={{padding:"16px 36px",background:C.acc,color:"#FFF",fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:3,borderRadius:99,fontWeight:700,animation:"glow 2s ease infinite"}}>
                      {copied?"COPIED!":"SHARE"}
                    </button>
                    {mode==="freeplay" && <button className="pill" onClick={nextFreePlay} style={{padding:"16px 32px",background:C.g,color:C.correctFg,fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:3,borderRadius:99,fontWeight:700}}>NEXT →</button>}
                    <button className="pill" onClick={goMenu} style={{padding:"16px 28px",background:C.s,color:C.tm,fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2,border:`1px solid ${C.bd}`,borderRadius:99}}>MENU</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
