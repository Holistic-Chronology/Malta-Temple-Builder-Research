# Site features


This section contains geojson files for GIS applications.
The files contain information about the source(s) of the coordinates. If there is uncertainty about the real coordinates, alternate coordinates are also present.


## Feature naming

The structure of the file names for individual _points_ is as follows:


- site or area letter code
- hyphen
- number
- underscore
- short descrption
- geojson extension

Example: **M-1028_North-Room-7-Left-Seat-Center-back.geojson**

For _surfaces_ the structure is:

- site or area letter code
- optionally: hypen and number
- underscore
- _site_ (complete area of a site), _shelter_ or the kind of the object (e.g. _megalith_)
- optionally: hyphen and a short description
- geojson extension

Examples: **M_shelter.geojson** and **HQMA-1002_megalith-ShadowStone.geojson**


## Feature codes:

All known sites have a 1-2 (occasionally 3) letter code. Three letter codes are in majority postal codes and are used for isolated observations where no specific site is identified (yet) (see the separate section below).  
For features in the vicinity of a site, the site code is appended with an A (area). In the case of obvious site clusters (like ĦaġarQim Mnajdra) the area code is a combination of the site codes followed by an A. When the cluster is combination of numbered sites, the area code is the general site code followed by an A (Borġ il-Għarib, BGI and BGII => BGA)

**Site and area codes:**

- B : Binġemma (cave)
- BGA : Borġ il-Għarib area
- BGI : Borġ il-Għarib I (Gozo)
- BGII : Borġ il-Għarib II (Gozo)
- BI : Borġ l-Imramma (Gozo)
- BM : Bur Megħeż (cave)
- BN : Borġ in-Nadur
- BU : Buġibba
- C : Taċ Ċawla (Gozo)
- DM : Id-Dura tal-Mara (Gozo)
- G : Ġgantija (Gozo)
- GD : Għar Dalam (cave)
- GG : Għar ta' Għejżu (Gozo) (cave)
- GH : Għajnsielem (Gozo)
- GM : Għar il-Mixta (Gozo) (cave)
- GN : Għar in-Ngħaġ (cave)
- GT : Għajn Tuffieħa
- GZ : Għajn Żejtuna
- HF : Ħal Far
- HG : Ħal Ġinwi
- HO : Il Ħofra
- HQ : Ħaġar Qim
- HQMA : ĦaġarQim Mnajdra area
- HS: Ħal Saflieni (hypogeum)
- HW : Il-Ħaġra il-Wieqfa (Gozo)
- IK : L-Iklin
- IM : L-Imrejżbiet (Gozo)
- KIII : Kordin III
- MA : Ta' Marżiena (Gozo)
- M : Mnajdra
- MI : Il-Misqa
- MO : Mosta
- NC : North cave (Gozo) (cave)
- Q : Qala (Gozo)
- QI : Qortin l'Imdawwar
- QM : Qaliet Marku
- RP : Ras il-Pellegrin
- S : Sanat (Gozo)
- SK : Skorba
- T : Tarxien
- TB : Ta' Blankas (Gozo) (wall)
- TBI : Tal-Bidni
- TF : Torri Falka (cave)
- TH : Ta' Ħaġrat
- TL : Ta' Lippija
- TM : Ta' Marżiena (Gozo)
- TP : Ta' Pergla iz-Zgħira (Gozo) (cave)
- TQ : Tal-Qadi
- TR : Ta' Raddiena
- TSI : Tas Silġ
- TSR : Tas-Sruġ (Gozo) (cave)
- TT : Tat-Tamla
- TU : It-Tumbata
- TZ : Ta' iż-Żgħira (burial site)
- V : Santa Verna (Gozo)
- WH : Wied Ħoxt
- XA : Xagħra Circle (Gozo) (hypogeum)
- XE : Xewkija (Gozo)
- XG : Xrobb l-Għaġin
- XI : Xemxija I
- XII : Xemxija II
- XT : Xagħra Tombs (Gozo) (burial site)

**Destroyed sites without code:**

- Debdieba
- Kordin I
- Kordin II
- Xewkija I (Gozo)
- Xewkija II (Gozo)




**Three letter postal codes:**


- ATD : Ħ'Attard
- BBĠ : Birżebbuġa
- BKR : Birkirkara
- BML : Bormla (Cospicua)
- BRG : Il-Birgu (Vittoriosa)
- BZN : Ħal Balzan
- DGL : Ħad-Dingli
- FGR : Il-Fgura
- FNT : Il-Fontana or It-Triq tal-Għajn
- FRN : Il-Furjana
- GDJ : Il-Gudja
- GĦR : Ħal Għargħur
- GRB: L-Għarb
- GSM: Għajnsielem
- GSR : L-Għasri
- GXQ : Ħal Għaxaq
- GŻR : Il-Gżira
- ĦMR : Il-Ħamrun
- IKL : L-Iklin
- ISL : L-Isla (Senglea)
- KĊM : Ta' Kerċem
- KKP : Ħal Kirkop
- KKR : Il-Kalkara
- LJA: Ħal Lija
- LQA : Ħal Luqa
- MDN : L-Imdina
- MFN : Marsalforn
- MĠR : L-Imġarr
- MLĦ : Il-Mellieħa
- MQB : L-Imqabba
- MRS : Il-Marsa
- MSD : L-Imsida
- MSK : Marsaskala
- MST : Il-Mosta and Il-Bidnija
- MTF: L-Imtarfa
- MXK : Marsaxlokk
- MXR : Il-Munxar
- NDR : In-Nadur
- NXR : In-Naxxar
- PBK : Pembroke
- PLA: Paola (Raħal Ġdid)
- PTA : Tal-Pietà
- QLA : Il-Qala
- QRD : Il-Qrendi
- QRM : Ħal Qormi
- RBT : Ir-Rabat (Malta)
- SFI : Ħal Safi
- SĠN : San Ġwann
- SĠW : Is-Siġġiewi
- SLĊ : Santa Luċija
- SLM : Tas-Sliema
- SLZ : San Lawrenz
- SNT : Ta' Sannat
- SPB : San Pawl il-Baħar
- STJ : San Ġiljan
- SVR : Santa Venera
- SWQ : Is-Swieqi
- TXN : Ħal Tarxien
- VCT : Ir-Rabat (Gozo)
- VLT : Il-Belt Valletta
- XBX : Ta' Xbiex
- XJR : Ix-Xgħajra
- XLN : Ix-Xlendi
- XRA : Ix-Xagħra
- XWK : Ix-Xewkija
- ŻBB : Iż-Żebbuġ (Gozo)
- ŻBĠ : Ħaż-Żebbuġ (Malta)
- ŻBR : Ħaż-Żabbar
- ŻRQ : Iż-Żurrieq
- ŻTN : Iż-Żejtun
