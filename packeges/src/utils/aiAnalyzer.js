class AIAnalyzer {
  static analyzeStartup(idea) {
    const analysis = {
      failureReasons: [],
      challenges: [],
      risks: [],
      milestones: []
    };

    if (!idea.problem || idea.problem.length < 15) {
      analysis.failureReasons.push('Weak or unclear problem definition');
      analysis.risks.push({
        type: 'Problem–Market Fit',
        level: 9,
        mitigation: 'Do 15–20 customer discovery interviews'
      });
    }

    if (!idea.market) {
      analysis.failureReasons.push('No defined market');
      analysis.risks.push({
        type: 'Market',
        level: 8,
        mitigation: 'Estimate TAM/SAM/SOM and define ICP'
      });
    }

    if (!idea.team || idea.team.split(',').length < 2) {
      analysis.failureReasons.push('Insufficient founding team');
      analysis.risks.push({
        type: 'Team',
        level: 7,
        mitigation: 'Find a complementary co-founder or core teammate'
      });
    }

    analysis.challenges = [
      'Finding early adopters',
      'Convincing investors without traction',
      'Balancing build vs validation'
    ];

    analysis.milestones = [
      {
        name: 'Customer Validation',
        week: 4,
        actions: ['Conduct 20 interviews', 'Write clear problem statement']
      },
      {
        name: 'MVP Launch',
        week: 12,
        actions: ['Implement core features', 'Get 5–10 active users']
      },
      {
        name: 'Fundraising Prep',
        week: 20,
        actions: ['Create pitch deck', 'Define KPIs', 'List 30–50 investors']
      }
    ];

    return analysis;
  }
}

module.exports = AIAnalyzer;
