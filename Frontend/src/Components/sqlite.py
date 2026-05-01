import sqlite3

DB_PATH = "database.db"

def get_connection():
    return sqlite3.connect(DB_PATH)

def init_db():
    with get_connection() as conn:
        curseur = conn.cursor()
        curseur.execute("""
                    CREATE TABLE IF NOT EXISTS produit(
                        id_produit INTEGER PRIMARY KEY AUTOINCREMENT,
                        reference TEXT NOT NULL,
                        prixunitaireht DECIMAL(14,2) NOT NULL
                        )
                    """)

        curseur.execute("""
                    CREATE TABLE IF NOT EXISTS client(
                        id_client INTEGER PRIMARY KEY AUTOINCREMENT,
                        nom TEXT NOT NULL,
                        prenom TEXT NOT NULL,
                        adresse TEXT NOT NULL,
                        cp TEXT NOT NULL,
                        ville TEXT NOT NULL
                        )
                    """)

        curseur.execute("""
                    CREATE TABLE IF NOT EXISTS facture(
                        id_facture INTEGER PRIMARY KEY AUTOINCREMENT,
                        code TEXT NOT NULL,
                        tauxtva DECIMAL(14,2) NOT NULL,
                        id_client INTEGER NOT NULL,
                        FOREIGN KEY (id_client) REFERENCES client(id_client)
                        )
                    """)

        curseur.execute("""
                    CREATE TABLE IF NOT EXISTS lignefacture(
                        id_produit INTEGER NOT NULL,
                        id_facture TEXT NOT NULL ,
                        quantite DECIMAL(14,2) NOT NULL,
                        PRIMARY KEY (id_produit, id_facture),
                        FOREIGN KEY (id_produit) REFERENCES produit(id_produit),
                        FOREIGN KEY (id_facture) REFERENCES facture(id_facture)
                        )
                    """)

        # Je vide les tables au cas où
        conn.execute("DELETE FROM lignefacture")
        conn.execute("DELETE FROM produit")
        conn.execute("DELETE FROM facture")
        conn.execute("DELETE FROM client")

        SQLQuery = "INSERT INTO client(id_client, nom, prenom, adresse, cp, ville) VALUES (:id_client, :nom, :prenom, :adresse, :codepostal, :ville)"
        curseur.executemany(SQLQuery, ({
                'id_client' : 1,
                'nom' : 'DUCK',
                'prenom' : 'Donald',
                'adresse' : 'En bas de la coline',
                'codepostal': '69008',
                'ville': 'LYON'
            },{
            'id_client' : 2,
            'nom': 'PICSOU',
            'prenom': 'Balthazar',
            'adresse': 'En haut de la coline',
            'codepostal': '69008',
            'ville': 'LYON'
            }))

        SQLQuery = 'INSERT INTO produit(id_produit, reference, prixunitaireht) VALUES (:id_produit, :ref, :prixht)'
        curseur.executemany(SQLQuery, (
            {'id_produit': 1, 'ref': 'PDT001', 'prixht': 18.5},
            {'id_produit': 2, 'ref': 'PDT002', 'prixht': 20},
            {'id_produit': 3, 'ref': 'PDT003', 'prixht': 125},
            {'id_produit': 4, 'ref': 'PDT004', 'prixht': 255}
        ))

        SQLQuery = 'INSERT INTO facture(id_facture, code, tauxtva, id_client) VALUES (:id_facture, :code, :tauxtva, :idclient)'
        curseur.executemany(SQLQuery, (
            {'id_facture': 1, 'code': 'FA00001', 'tauxtva': 20, 'idclient': 1},
            {'id_facture': 2, 'code': 'FA00002', 'tauxtva': 20, 'idclient': 1},
            {'id_facture': 3, 'code': 'FA00003', 'tauxtva': 5.5, 'idclient': 2},
            {'id_facture': 4, 'code': 'FA00004', 'tauxtva': 5.5, 'idclient': 1}
        ))

        SQLQuery = 'INSERT INTO lignefacture(id_produit, id_facture, quantite) VALUES (:idp, :idf, :qte)'
        curseur.executemany(SQLQuery, (
            {'idp': 1, 'idf': 1, 'qte': 12},
            {'idp': 2, 'idf': 1, 'qte': 10},
            {'idp': 1, 'idf': 2, 'qte': 25},
            {'idp': 1, 'idf': 3, 'qte': 5},
            {'idp': 3, 'idf': 3, 'qte': 9},
            {'idp': 2, 'idf': 4, 'qte': 20},
            {'idp': 3, 'idf': 4, 'qte': 12},
            {'idp': 4, 'idf': 4, 'qte': 8}
        ))
        conn.commit()
        
         SQLQuery = 'Select facture.id_facture, client.nom, client.prenom, produit.reference, lignefacture.quantite, produit.prixunitaireht, facture.tauxtva FROM facture JOIN client ON facture.id_client = client.id_client JOIN lignefacture ON facture.id_facture = lignefacture.id_facture JOIN produit ON lignefacture.id_produit = produit.id_produit'

          SQLQuery = 'Select  facture.id_facture, client.nom, client.prenom,tva.tauxtva, ht.prixht from facture join client on facture.id_client = client.id_client join (select lignefacture.id_facture, sum(lignefacture.quantite * produit.prixunitaireht) as prixht from lignefacture join produit on lignefacture.id_produit = produit.id_produit group by lignefacture.id_facture) as ht on ht.id_facture = facture.id_facture join (select id_facture, tauxtva from facture) as tva on tva.id_facture = facture.id_facture'   
          
          Je récupère tous les produits , ils doivent avoir référence et prixunitaireht
          SQLQuery = 'Select reference, prixunitaireht from produit'
            conn.commit()
            
        # Exemple de requête pour vérifier les données insérées
        Récuperer les produits les plus vendus : référence , prixunitaireht,et le nombre de vente par ordre décroissant du nombre de vente
        SQLQuery = 'Select produit.reference, produit.prixunitaireht, sum(lignefacture.quantite) as nombre_ventes from lignefacture join produit on lignefacture.id_produit = produit.id_produit group by produit.id_produit order by nombre_ventes DESC'
        curseur.execute(SQLQuery)
        results = curseur.fetchall()
        for row in results:
            print(row)  
            
        Permettre de réaliser le CA 
        