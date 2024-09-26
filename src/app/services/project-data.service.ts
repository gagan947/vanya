import { Injectable } from '@angular/core'
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {
  constructor () {}

  projectTypes () {
    return project_types
  }

  sdg () {
    return sdgData
  }

  projectPhase () {
    return ProjectCurrentPhase
  }
}

const project_types: any = [
  {
    id: 1,
    type: 'Afforestation/Reforestation (A/R) ',
    sdgs: [
      {
        id: 13,
        name: 'Climate Action',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
        description:
          'Take urgent action to combat climate change and its impacts'
      },
      {
        id: 15,
        name: 'Life on Land',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg',
        description:
          'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss'
      },
      {
        id: 6,
        name: 'Clean Water and Sanitation',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg',
        description:
          'Ensure availability and sustainable management of water and sanitation for all'
      },
      {
        id: 1,
        name: 'No Poverty',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-01.jpg',
        description: 'End poverty in all its forms everywhere'
      },
      {
        id: 8,
        name: 'Decent Work and Economic Growth',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg',
        description:
          'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all'
      }
    ]
  },
  {
    id: 2,
    type: 'Avoided Deforestation and Degradation (REDD+) ',
    sdgs: [
      {
        id: 13,
        name: 'Climate Action',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
        description:
          'Take urgent action to combat climate change and its impacts'
      },
      {
        id: 15,
        name: 'Life on Land',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg',
        description:
          'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss'
      },
      {
        id: 1,
        name: 'No Poverty',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-01.jpg',
        description: 'End poverty in all its forms everywhere'
      },
      {
        id: 2,
        name: 'Zero Hunger',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-02.jpg',
        description:
          'End hunger, achieve food security and improved nutrition and promote sustainable agriculture'
      },
      {
        id: 8,
        name: 'Decent Work and Economic Growth',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg',
        description:
          'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all'
      }
    ]
  },
  {
    id: 3,
    type: 'Soil Carbon Sequestration ',
    sdgs: [
      {
        id: 13,
        name: 'Climate Action',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
        description:
          'Take urgent action to combat climate change and its impacts'
      },
      {
        id: 2,
        name: 'Zero Hunger',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-02.jpg',
        description:
          'End hunger, achieve food security and improved nutrition and promote sustainable agriculture'
      },
      {
        id: 15,
        name: 'Life on Land',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg',
        description:
          'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss'
      },
      {
        id: 6,
        name: 'Clean Water and Sanitation',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg',
        description:
          'Ensure availability and sustainable management of water and sanitation for all'
      },
      {
        id: 12,
        name: 'Responsible Consumption and Production',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg',
        description: 'Ensure sustainable consumption and production patterns'
      }
    ]
  },
  {
    id: 4,
    type: 'Mangrove Restoration ',
    sdgs: [
      {
        id: 13,
        name: 'Climate Action',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
        description:
          'Take urgent action to combat climate change and its impacts'
      },
      {
        id: 14,
        name: 'Life Below Water',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-14.jpg',
        description:
          'Conserve and sustainably use the oceans, seas and marine resources for sustainable development'
      },
      {
        id: 15,
        name: 'Life on Land',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg',
        description:
          'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss'
      },
      {
        id: 6,
        name: 'Clean Water and Sanitation',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg',
        description:
          'Ensure availability and sustainable management of water and sanitation for all'
      },
      {
        id: 1,
        name: 'No Poverty',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-01.jpg',
        description: 'End poverty in all its forms everywhere'
      }
    ]
  },
  {
    id: 5,
    type: 'Blue Carbon ',
    sdgs: [
      {
        id: 13,
        name: 'Climate Action',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
        description:
          'Take urgent action to combat climate change and its impacts'
      },
      {
        id: 14,
        name: 'Life Below Water',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-14.jpg',
        description:
          'Conserve and sustainably use the oceans, seas and marine resources for sustainable development'
      },
      {
        id: 15,
        name: 'Life on Land',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg',
        description:
          'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss'
      },
      {
        id: 11,
        name: 'Sustainable Cities and Communities',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-11.jpg',
        description:
          'Make cities and human settlements inclusive, safe, resilient and sustainable'
      }
    ]
  },
  {
    id: 6,
    type: 'Forest Management ',
    sdgs: [
      {
        id: 13,
        name: 'Climate Action',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
        description:
          'Take urgent action to combat climate change and its impacts'
      },
      {
        id: 15,
        name: 'Life on Land',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg',
        description:
          'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss'
      },
      {
        id: 8,
        name: 'Decent Work and Economic Growth',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg',
        description:
          'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all'
      },
      {
        id: 12,
        name: 'Responsible Consumption and Production',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg',
        description: 'Ensure sustainable consumption and production patterns'
      }
    ]
  },
  {
    id: 7,
    type: 'Biochar ',
    sdgs: [
      {
        id: 13,
        name: 'Climate Action',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
        description:
          'Take urgent action to combat climate change and its impacts'
      },
      {
        id: 2,
        name: 'Zero Hunger',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-02.jpg',
        description:
          'End hunger, achieve food security and improved nutrition and promote sustainable agriculture'
      },
      {
        id: 12,
        name: 'Responsible Consumption and Production',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg',
        description: 'Ensure sustainable consumption and production patterns'
      },
      {
        id: 15,
        name: 'Life on Land',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg',
        description:
          'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss'
      }
    ]
  },
  {
    id: 8,
    type: 'Solar Panel (Renewable Energy) ',
    sdgs: [
      {
        id: 7,
        name: 'Affordable and Clean Energy',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg',
        description:
          'Ensure access to affordable, reliable, sustainable and modern energy for all'
      },
      {
        id: 13,
        name: 'Climate Action',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
        description:
          'Take urgent action to combat climate change and its impacts'
      },
      {
        id: 11,
        name: 'Sustainable Cities and Communities',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-11.jpg',
        description:
          'Make cities and human settlements inclusive, safe, resilient and sustainable'
      },
      {
        id: 9,
        name: 'Industry, Innovation, and Infrastructure',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-09.jpg',
        descriptiom:
          'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation'
      },
      {
        id: 8,
        name: 'Decent Work and Economic Growth',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg',
        description:
          'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all'
      }
    ]
  },
  {
    id: 9,
    type: 'Green Building ',
    sdgs: [
      {
        id: 11,
        name: 'Sustainable Cities and Communities',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-11.jpg',
        description:
          'Make cities and human settlements inclusive, safe, resilient and sustainable'
      },
      {
        id: 7,
        name: 'Affordable and Clean Energy',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg',
        description:
          'Ensure access to affordable, reliable, sustainable and modern energy for all'
      },
      {
        id: 13,
        name: 'Climate Action',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
        description:
          'Take urgent action to combat climate change and its impacts'
      },
      {
        id: 9,
        name: 'Industry, Innovation, and Infrastructure',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-09.jpg',
        descriptiom:
          'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation'
      },
      {
        id: 12,
        name: 'Responsible Consumption and Production',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg',
        description: 'Ensure sustainable consumption and production patterns'
      }
    ]
  },
  {
    id: 10,
    type: 'Water Conservation and Management ',
    sdgs: [
      {
        id: 6,
        name: 'Clean Water and Sanitation',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg',
        description:
          'Ensure availability and sustainable management of water and sanitation for all'
      },
      {
        id: 13,
        name: 'Climate Action',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
        description:
          'Take urgent action to combat climate change and its impacts'
      },
      {
        id: 12,
        name: 'Responsible Consumption and Production',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg',
        description: 'Ensure sustainable consumption and production patterns'
      },
      {
        id: 11,
        name: 'Sustainable Cities and Communities',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-11.jpg',
        description:
          'Make cities and human settlements inclusive, safe, resilient and sustainable'
      }
    ]
  },
  {
    id: 11,
    type: 'Wind Energy ',
    sdgs: [
      {
        id: 7,
        name: 'Affordable and Clean Energy',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg',
        description:
          'Ensure access to affordable, reliable, sustainable and modern energy for all'
      },
      {
        id: 13,
        name: 'Climate Action',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
        description:
          'Take urgent action to combat climate change and its impacts'
      },
      {
        id: 9,
        name: 'Industry, Innovation, and Infrastructure',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-09.jpg',
        descriptiom:
          'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation'
      },
      {
        id: 8,
        name: 'Decent Work and Economic Growth',
        logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg',
        description:
          'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all'
      }
    ]
  }
]

const sdgData: any = [
  {
    id: 1,
    name: 'No Poverty',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-01.jpg',
    description: 'End poverty in all its forms everywhere'
  },
  {
    id: 2,
    name: 'Zero Hunger',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-02.jpg',
    description:
      'End hunger, achieve food security and improved nutrition and promote sustainable agriculture'
  },
  {
    id: 6,
    name: 'Clean Water and Sanitation',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg',
    description:
      'Ensure availability and sustainable management of water and sanitation for all'
  },
  {
    id: 7,
    name: 'Affordable and Clean Energy',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg',
    description:
      'Ensure access to affordable, reliable, sustainable and modern energy for all'
  },
  {
    id: 8,
    name: 'Decent Work and Economic Growth',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg',
    description:
      'Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all'
  },
  {
    id: 9,
    name: 'Industry, Innovation, and Infrastructure',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-09.jpg',
    descriptiom:
      'Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation'
  },
  {
    id: 11,
    name: 'Sustainable Cities and Communities',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-11.jpg',
    description:
      'Make cities and human settlements inclusive, safe, resilient and sustainable'
  },
  {
    id: 12,
    name: 'Responsible Consumption and Production',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg',
    description: 'Ensure sustainable consumption and production patterns'
  },
  {
    id: 13,
    name: 'Climate Action',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg',
    description: 'Take urgent action to combat climate change and its impacts'
  },
  {
    id: 14,
    name: 'Life Below Water',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-14.jpg',
    description:
      'Conserve and sustainably use the oceans, seas and marine resources for sustainable development'
  },
  {
    id: 15,
    name: 'Life on Land',
    logo: 'https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg',
    description:
      'Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss'
  }
]

const ProjectCurrentPhase = [
  {
    id: 1,
    name: 'Validation Stage'
  },
  {
    id: 2,
    name: 'Monitoring Stage'
  },
  {
    id: 3,
    name: 'Verification Stage'
  },
  {
    id: 4,
    name: 'Credits Issued'
  }
]
