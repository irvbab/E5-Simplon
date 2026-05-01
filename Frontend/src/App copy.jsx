import Header from './Components/Header'
import Footer from './Components/Footer'
import Card from './Components/Card'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return(
    <>
      <Header />
      <main>
        <h2>Liste des cartes</h2>
        <Card title="Carte 1" description="Ceci est la description de la carte 1." />
        <Card title="Carte 2" description="Ceci est la description de la carte 2." />
        <Card title="Carte 3" description="Ceci est la description de la carte 3." />
      </main>
      <h1> Mon application react</h1>
      <Footer />
    </>
  );
  
}

export default App

