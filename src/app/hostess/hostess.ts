import { Component } from '@angular/core';
import { HostessEvento } from './hostess-evento/hostess-evento';

@Component({
  selector: 'app-hostess',
  imports: [HostessEvento],
  templateUrl: './hostess.html',
  styleUrl: './hostess.scss',
})
export class Hostess {

  eventos = [
    {
      titulo: 'Conferência de Jovens',
      data: '10 de Julho, 2025',
      imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZu2aIKGGrxeu6mdrA6MgMjjf6hdBRdX_sy1f5lvxyFubx5uHHqMcD8FekDR5UM7upyycPlxAwonN0XI5EpRK8OEW_cEbT8TSxzd1kMHdadqNofmx3JT7JoU3TijSbrcpbY1ka4EcFaJT-fNTZsEoH1TYQj4uHEnSTHs3wqw9Lg_hVqJ-iH86xEsfKi_Jgei8hP09_tbMhgTl2vSgki4eT_fDVyCfRf2eMlhGfNCm86yrrn44KmbG9-2OmBXqIxZQRpcTejizXWsw',
      vendidos: {
        count: 150,
        total: 200
      },
      presentes: {
        count: 80,
        total: 150
      }
    },
    {
      titulo: 'Culto de Celebração',
      data: '15 de Agosto, 2025',
      imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6otMPYaTS3vYPcpEuebu-57i1F9Hc88r7SivI14xqSiE4g5X9W-ipp7m1I7oACSLxFegd0cSkTlYgMtkG9SDDB9zoSb0L1CekNOq6X-drE53X57aQioaTlXl4MAuQPPoV4PtzQYs5WC8-EiUWy0axD2xNShl8x8v18xJ2DELdWSAFeucNC3HqyLlapi8Qtn8s5JH6N5qYBYvbrnHZW5gchetnX33zBkhBnMgAEn99szAlSe0dBw9ULxwcbZ6vkZzVZ4GZ3hA18lQ',
      vendidos: {
        count: 300,
        total: 300
      },
      presentes: {
        count: 280,
        total: 300
      }
    },
    {
      titulo: 'Encontro de Casais',
      data: '20 de Setembro, 2025',
      imagem: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPTXIf6cK9514COjfoFiFI7UHxIrTrV1Uc_rnZQvmjh8ZJwP9OTn-INivvgrSFVsPUKO-dxynD2CbeByolJbW55_mss7djFOCp88xB5WLG-2hO91lMOrMug5EKGOro8-bUMcC27EQXBJ-t1LKAe3Aci38sNHkMKEh4sWqhQ3f0xNdJPPRjuqS5LsMriokijjsjSQRsgen5xW7sggscihb1dAPwZXkiJQvihIbdnKyvAtRIPpIH4skqeKVKoDTurWuBp-yIeiXFkFI',
      vendidos: {
        count: 50,
        total: 100
      },
      presentes: {
        count: 20,
        total: 50
      }
    }
  ]

  goBack() {

  }
}
