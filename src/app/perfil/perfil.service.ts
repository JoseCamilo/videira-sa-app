import { Injectable, inject } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, setDoc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Observable, from, of, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

export interface UserProfile {
  email: string;
  nome?: string;
  foto?: string;
  igreja?: string;
  funcao?: string;
  pastor?: string;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private firestore = inject(Firestore);

  // BehaviorSubjects para as listas de opções
  private igrejasSubject = new BehaviorSubject<string[]>([]);
  private funcoesSubject = new BehaviorSubject<string[]>([]);
  private pastoresSubject = new BehaviorSubject<string[]>([]);

  igrejas$ = this.igrejasSubject.asObservable();
  funcoes$ = this.funcoesSubject.asObservable();
  pastores$ = this.pastoresSubject.asObservable();

  // Getters para valores síncronos
  get igrejas(): string[] {
    return this.igrejasSubject.value;
  }

  get funcoes(): string[] {
    return this.funcoesSubject.value;
  }

  get pastores(): string[] {
    return this.pastoresSubject.value;
  }

  /**
   * Carrega as opções do Firestore
   */
  carregarOpcoes(igreja?: string): void {
    
    this.carregarOpcaoDoFirestore('predios').subscribe(opcoes => {
      this.igrejasSubject.next(opcoes);
    });

    this.carregarOpcaoDoFirestore('funcoes').subscribe(opcoes => {
      this.funcoesSubject.next(opcoes);
    });

    this.carregarOpcaoDoFirestore('pastores', igreja).subscribe(opcoes => {
      this.pastoresSubject.next(opcoes);
    });
  }

  /**
   * Carrega uma lista de opções do Firestore collection "supervisao"
   * @param docName Nome do documento (ex: 'igrejas', 'funcoes', 'pastores')
   * @returns Observable com array de strings
   */
  private carregarOpcaoDoFirestore(docName: string, predio?: string): Observable<string[]> {
    let docSearch = docName;

    if (docName === 'pastores') {
        docSearch = 'predios';
    }

    return from(getDoc(doc(this.firestore, 'supervisao', docSearch))).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as any;

          if (docName === 'predios' && data?.items) {
            // Extrai apenas os nomes das predios
            return data.items.map((item: any) => item.nome);
          }

          if (docName === 'pastores' && data?.items && predio) {
            // Filtra pastores por prédio, se fornecido
            const filteredPredio = predio
                ? data.items.filter((item: any) => item.nome === predio)
                : [];
            return filteredPredio[0]?.pastores || [];
          }
          return data?.items || [];
        }
        return [];
      }),
      catchError(err => {
        console.error(`Erro ao carregar ${docName}:`, err);
        return of([]);
      })
    );
  }

  /**
   * Filtra pastores por igreja selecionada
   * @param igrejaSelecionada Nome da igreja/prédio
   * @returns Observable com array de pastores filtrados
   */
  filtrarPastoresPorIgreja(igrejaSelecionada: string): Observable<string[]> {
    if (!igrejaSelecionada) {
      return this.pastores$;
    }

    return this.carregarOpcaoDoFirestore('pastores', igrejaSelecionada);
  }

  /**
   * Busca o perfil do usuário pelo email
   * @param email Email do usuário
   * @returns Observable com o perfil do usuário ou null
   */
  getPerfilByEmail(email: string): Observable<UserProfile | null> {
    if (!email) {
      return of(null);
    }

    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));

    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (snapshot.empty) {
          return null;
        }
        const doc = snapshot.docs[0];
        return {
          email,
          ...doc.data()
        } as UserProfile;
      }),
      catchError(err => {
        console.error('Erro ao buscar perfil:', err);
        return of(null);
      })
    );
  }

  /**
   * Salva ou atualiza o perfil do usuário
   * Se o email não existir, cria um novo documento
   * @param perfil Dados do perfil a salvar
   * @returns Promise com o resultado da operação
   */
  async saveOrUpdatePerfil(perfil: UserProfile): Promise<void> {
    try {
      if (!perfil.email) {
        throw new Error('Email é obrigatório');
      }

      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', perfil.email));
      const snapshot = await getDocs(q);

      const dataToSave = {
        ...perfil,
        updatedAt: new Date()
      };

      if (snapshot.empty) {
        // Documento não existe, criar um novo
        const newDocRef = doc(usersRef);
        await setDoc(newDocRef, dataToSave);
      } else {
        // Documento existe, atualizar
        const existingDocRef = doc(usersRef, snapshot.docs[0].id);
        await updateDoc(existingDocRef, dataToSave);
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      throw error;
    }
  }

  /**
   * Atualiza apenas campos específicos do perfil
   * @param email Email do usuário
   * @param updates Campos a atualizar
   * @returns Promise com o resultado da operação
   */
  async updatePerfilFields(email: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const usersRef = collection(this.firestore, 'users');
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error('Perfil não encontrado');
      }

      const docRef = doc(usersRef, snapshot.docs[0].id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }
}
