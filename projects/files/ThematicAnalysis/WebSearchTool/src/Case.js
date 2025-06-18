class Case {
  constructor(description, example) {
    this.description = description;
  }

  // Case to string method
  toString() {
    return `Case: ${this.description}`;
  }
}
