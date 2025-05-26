import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="container">
      <h1>Password Generator</h1>
      
      <div class="options">
        <div class="length-control">
          <label for="length">Password Length:</label>
          <input 
            type="number" 
            id="length" 
            [value]="length" 
            (input)="onLengthChange($event)"
            min="4"
            max="50"
          >
        </div>

        <div class="checkboxes">
          <label>
            <input 
              type="checkbox" 
              [checked]="includeUppercase" 
              (change)="includeUppercase = !includeUppercase"
            >
            Include Uppercase
          </label>

          <label>
            <input 
              type="checkbox" 
              [checked]="includeLowercase" 
              (change)="includeLowercase = !includeLowercase"
            >
            Include Lowercase
          </label>

          <label>
            <input 
              type="checkbox" 
              [checked]="includeNumbers" 
              (change)="includeNumbers = !includeNumbers"
            >
            Include Numbers
          </label>

          <label>
            <input 
              type="checkbox" 
              [checked]="includeSymbols" 
              (change)="includeSymbols = !includeSymbols"
            >
            Include Symbols
          </label>
        </div>
      </div>

      <div class="password-display">
        <input 
          type="text" 
          [value]="generatedPassword" 
          readonly 
          #passwordInput
        >
        <button (click)="copyToClipboard(passwordInput)">Copy</button>
      </div>

      <button class="generate-btn" (click)="generatePassword()">Generate Password</button>

      <div class="strength-meter">
        <div>Password Strength:</div>
        <div [class]="'strength-indicator ' + passwordStrength">{{passwordStrength}}</div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 500px;
      margin: 2rem auto;
      padding: 2rem;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }

    .options {
      margin-bottom: 2rem;
    }

    .length-control {
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .length-control input {
      width: 80px;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .checkboxes {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    .checkboxes label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    .password-display {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .password-display input {
      flex: 1;
      padding: 0.8rem;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-family: monospace;
      font-size: 1.1rem;
    }

    button {
      padding: 0.8rem 1.5rem;
      border: none;
      border-radius: 4px;
      background: #4CAF50;
      color: white;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover {
      background: #45a049;
    }

    .generate-btn {
      width: 100%;
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
    }

    .strength-meter {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .strength-indicator {
      padding: 0.4rem 1rem;
      border-radius: 4px;
      text-transform: capitalize;
    }

    .weak { background: #ff4444; color: white; }
    .medium { background: #ffbb33; color: black; }
    .strong { background: #00C851; color: white; }
  `]
})
export class AppComponent {
  length: number = 12;
  includeUppercase: boolean = true;
  includeLowercase: boolean = true;
  includeNumbers: boolean = true;
  includeSymbols: boolean = true;
  generatedPassword: string = '';
  passwordStrength: string = '';

  onLengthChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.length = Math.max(4, Math.min(50, parseInt(input.value) || 12));
  }

  generatePassword() {
    let charset = '';
    if (this.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (this.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (this.includeNumbers) charset += '0123456789';
    if (this.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charset) {
      this.generatedPassword = 'Please select at least one option';
      return;
    }

    let password = '';
    for (let i = 0; i < this.length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    this.generatedPassword = password;
    this.calculatePasswordStrength(password);
  }

  calculatePasswordStrength(password: string) {
    let score = 0;
    
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;
    
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score >= 5) this.passwordStrength = 'strong';
    else if (score >= 3) this.passwordStrength = 'medium';
    else this.passwordStrength = 'weak';
  }

  copyToClipboard(inputElement: HTMLInputElement) {
    if (!this.generatedPassword) return;
    inputElement.select();
    document.execCommand('copy');
    window.getSelection()?.removeAllRanges();
  }
} 