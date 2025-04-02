import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../character.service';
import { Character } from '../character.model';

@Component({
  selector: 'app-character-create',
  standalone: false,
  templateUrl: './character-create.component.html',
  styleUrl: './character-create.component.css'
})
export class CharacterCreateComponent implements OnInit {
  characterForm: FormGroup;
  traitInput = new FormControl('');
  traits: string[] = [];
  isEditMode = false;
  characterId: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: ['https://placehold.co/150x150']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.characterId = id;
        this.loadCharacter(id);
      }
    });
  }

  loadCharacter(id: string): void {
    this.characterService.getCharacter(id).subscribe({
      next: (character) => {
        this.characterForm.patchValue({
          name: character.name,
          description: character.description,
          imageUrl: character.imageUrl
        });
        this.traits = character.traits || [];
      },
      error: (error) => {
        console.error('Error loading character', error);
      }
    });
  }

  addTrait(): void {
    const trait = this.traitInput.value?.trim();
    if (trait && !this.traits.includes(trait)) {
      this.traits.push(trait);
      this.traitInput.reset();
    }
  }

  removeTrait(index: number): void {
    this.traits.splice(index, 1);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.characterForm.valid) {
      const characterData: Character = {
        ...this.characterForm.value,
        traits: this.traits
      };

      if (this.isEditMode && this.characterId) {
        this.characterService.updateCharacter(this.characterId, characterData).subscribe({
          next: () => {
            this.router.navigate(['/characters', this.characterId]);
          },
          error: (error) => {
            console.error('Error updating character', error);
          }
        });
      } else {
        this.characterService.createCharacter(characterData).subscribe({
          next: (newCharacter) => {
            this.router.navigate(['/characters', newCharacter._id]);
          },
          error: (error) => {
            console.error('Error creating character', error);
          }
        });
      }
    }
  }

  get f() { return this.characterForm.controls; }
}