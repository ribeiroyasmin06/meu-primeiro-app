 import { Component, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';



import { Produto } from '../produto/produto';

@Component({
  selector: 'app-lista-produtos',
  imports: [Produto],
  templateUrl: './lista-produtos.html',
  styleUrl: './lista-produtos.css',
})
export class ListaProdutos {
  //SIGNALS

  //writable signal - signal (reativo) que permite alterações (com set ou update)

  produtos = signal<{ nome: string; preco: number }[]>([]);

  carregando = signal(true);

  produtoSelecionado = signal<string | null>(null);

  carrinho = signal<{ nome: string; preco: number }[]>([]);

  // COMPUTED SIGNALS

  // computed signal - observa outro signal e se atualiza automaticamente
  totalProdutos = computed(() => this.produtos().length);

  valorTotal = computed(() => {
    return this.produtos().reduce((total, item) => total + item.preco, 0);
  }); //computed signal - esse calcula o valor total dos produtos

  quantidadeCarrinho = computed(() => this.carrinho().length);

  totalCarrinho = computed(() => {
    return this.carrinho().reduce((total, item) => total + item.preco, 0);
  });

  // EFFECTS
  //método construtor - formata os objetos criados a partir desta classe
 
 constructor(private http: HttpClient) {
    // carrega da API
    this.carregarProdutos();

    // effects continuam iguais
    effect(() => {
      console.log('Lista de produtos alterada:', this.produtos());
    });

    effect(() => {
      console.log('Valor total atualizado:', this.valorTotal());
    });
    effect(() => {
      if (typeof document !== 'undefined') {
        document.title = `(${this.totalProdutos()}) Minha Loja`;
      }
    });
  }

    //fim do costrutor

    carregarProdutos() {
    // inicia loading
    this.carregando.set(true);

    this.http
      .get<{ title: string; price: number }[]>('https://fakestoreapi.com/products')
      .subscribe({
        next: (dados) => {
          // Adaptação da API para o nosso projeto
          const produtosFormatados = dados.map((p) => ({
            nome: p.title,
            preco: p.price,
          }));

          this.produtos.set(produtosFormatados);
          this.carregando.set(false); // finaliza loading
        },

        error: (erro) => {
          console.error('Erro ao carregar produtos:', erro);
          this.carregando.set(false); // evita loading infinito
        },
      });
  }
  
  
  // AÇÕES QUE ALTERAM VALORES DE SIGNALS (SET E UPDATE)

  exibirProduto(nome: string) {
    this.produtoSelecionado.set(nome);
  }
  // update - adiciona um item ao writable signal
  adicionarProduto() {
    this.produtos.update((listaAtual) => [...listaAtual, { nome: 'Teclado', preco: 250 }]);
  }
  //altera um item ao writable signal - o set é pra alterar o que já existe
  substituirProdutos() {
    this.produtos.set([{ nome: 'Produto novo', preco: 999 }]);
  }
  adicionarAoCarrinho(produto: { nome: string; preco: number }) {
    this.carrinho.update((listaAtual) => [...listaAtual, produto]);
  }
}

