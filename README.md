# Neuro-Evolution-Cocktail-Party

[Live Demo](https://douglasdev.github.io/projects/Cocktail%20Party%20Neuro%20Evolution/index.html)

![screenshot1](https://i.ibb.co/vYV23yy/screenshot-1.png)
![screenshot2](https://i.ibb.co/QMHnxgH/screenshot2.png)

A simulation of human social interaction, which evolves social agents that can adapt to one another's behaviors. Uses a JavaScript implementation of the NEAT (Neuro Evolution through Augmented Topology) genetic algorithm, which evolves neural networks through the process of Darwinian evolution. 

The agents live on a two dimention grid, and during each turn can choose to perform one of several actions:

- walk up, down, left, or right
- make conversation
- complement other agents
- insult other agents

The agents possess an awareness of the surrounding squares, and can listen to any agent on an adjacent square. They also possess an array of values representing how much they like the other agents. This value changes according to the following rules:

- If an agent makes conversation, the surround agents will like them slightly more
- If an agent hears another agent complement them, they will like that agent a lot more.
- If an agent hears another agent insult them, they will like that agent a lot less.
- If an agent overhears an agent complementing someone else, the agent will like the person being complemented slightly more. If their like value of the person being complemented is less than 0, they will like the person giving the complement less. Otherwise they will like the person giving the complement more.
- If an agent overhears an agent insulting someone else, the agent will like the person being insulted slightly less. If their like value of the person being insulted is less than 0, they will like the person saying the insult more. Otherwise they will like the person saying the insult less.

The agents all possess a memory of the results of their last several actions, which can inform their future behavior.

Each agent is controlled by a neural network which receives data about the agent's surrounds and the agent's memory as input, and outputs a choice of an action. The exact architecture of the network, and well as the connection strengths between neurons will change, mutate, and evolve over time.

After 50 iterations, the current generation of agents ends and the agents are ranked according to a fitness function which takes into account their popularity, their loneliness (how much time they spend not interacting with other agents), and the complexity of their neural networks. The highest ranked agents are mated and mutated to produce the next generation. Interesting behaviors generally emerge after a few dozen generations, but it may also take several hundred generations. Evolution is a chaotic process.

# Technologies Used: Vanilla JS and Neatapic.js
