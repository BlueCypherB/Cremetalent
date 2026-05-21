-- =============================================================
-- CrémeTalent — Seed Data
-- Run this AFTER schema.sql in the Supabase SQL Editor
-- =============================================================

-- ---------------------------------------------------------------
-- Projects (migrated from src/pages/Projects.tsx hardcoded data)
-- ---------------------------------------------------------------
insert into public.projects
  (title, category, short_description, full_description, goal_amount, duration_days, raised_amount, backers_count, slug, creator_name, is_published)
values
  (
    'Educational Scholarship for Aspiring Medical Students',
    'Education',
    'Help support the next generation of medical professionals with scholarships for underprivileged students.',
    'This initiative aims to provide full and partial scholarships to outstanding medical students from low-income backgrounds. Funds will cover tuition, books, and living expenses for the first two years of medical school.',
    25000, 18, 12500, 34, 'med-scholarship', 'Dr. Amanda Chen', true
  ),
  (
    'Community Art Center Renovation',
    'Arts',
    'Renovating a community space to provide a creative hub for artists of all ages in our neighborhood.',
    'The Local Artists Collective is renovating an abandoned warehouse into a vibrant community art center featuring gallery space, workshops, and artist studios available to the public at affordable rates.',
    15000, 30, 8200, 21, 'art-center', 'Local Artists Collective', true
  ),
  (
    'Tech Training Program for Underserved Youth',
    'Technology',
    'Providing coding bootcamps and mentorship for youth from underserved communities.',
    'Future Coders Initiative runs intensive 12-week coding bootcamps for youth aged 16–24 from underserved communities, providing laptops, internet access, and post-graduation job placement support.',
    20000, 12, 18500, 67, 'tech-training', 'Future Coders Initiative', true
  ),
  (
    'Urban Garden Community Project',
    'Environment',
    'Creating sustainable urban gardens to provide fresh produce and green spaces in urban food deserts.',
    'The Green City Coalition is transforming vacant lots into thriving urban gardens, providing fresh produce to food desert communities and creating green spaces for recreation and environmental education.',
    10000, 45, 3400, 12, 'urban-garden', 'Green City Coalition', true
  ),
  (
    'Documentary on Immigrant Entrepreneurs',
    'Film',
    'A documentary highlighting the success stories and challenges faced by immigrant entrepreneurs.',
    'This feature-length documentary profiles 10 immigrant entrepreneurs across Nigeria, Ghana, and South Africa, exploring how they built successful businesses despite systemic challenges. The film will be submitted to international film festivals.',
    30000, 22, 15000, 89, 'immigrant-entrepreneurs', 'New Horizons Film Collective', true
  ),
  (
    'Mobile Healthcare for Rural Communities',
    'Healthcare',
    'Bringing essential healthcare services to isolated rural communities through mobile clinics.',
    'Health Access Now is deploying three fully-equipped mobile clinics to serve rural communities in underserved regions, providing primary care, vaccinations, maternal health services, and chronic disease management.',
    50000, 15, 22000, 103, 'mobile-healthcare', 'Health Access Now', true
  );


-- ---------------------------------------------------------------
-- Blog Posts (migrated from src/pages/Blog.tsx hardcoded data)
-- ---------------------------------------------------------------
insert into public.blog_posts
  (title, slug, excerpt, category, author_name, read_time, is_featured, is_published, published_at)
values
  (
    'Navigating the Creative Job Market in 2025',
    'navigating-creative-job-market-2025',
    'How to position yourself for success in a rapidly evolving creative economy with emerging technologies and changing client expectations.',
    'Career Advice', 'Emma Davis', '8 min read', true, true, '2025-05-03'::timestamptz
  ),
  (
    'Top Skills Employers Look for in Creatives',
    'top-skills-employers-look-for-creatives',
    'Beyond technical prowess: the soft skills and adaptability traits that make creative professionals stand out to potential employers.',
    'Career Development', 'Marcus Chen', '10 min read', true, true, '2025-04-28'::timestamptz
  ),
  (
    'Building a Sustainable Creative Career',
    'building-sustainable-creative-career',
    'Strategies for long-term success and fulfillment in the creative industry, from financial planning to avoiding burnout.',
    'Work-Life Balance', 'Sophia Rodriguez', '12 min read', true, true, '2025-04-22'::timestamptz
  ),
  (
    'The Rise of AI in Creative Work',
    'rise-of-ai-in-creative-work',
    'How artificial intelligence is transforming creative processes and what professionals need to know to stay relevant.',
    'Industry Trends', 'James Wilson', '9 min read', false, true, '2025-04-15'::timestamptz
  ),
  (
    'Crafting a Portfolio That Gets Noticed',
    'crafting-portfolio-that-gets-noticed',
    'Expert tips for creating a standout creative portfolio that showcases your best work and attracts ideal clients or employers.',
    'Portfolio Tips', 'Aisha Patel', '7 min read', false, true, '2025-04-08'::timestamptz
  ),
  (
    'Networking Strategies for Introverted Creatives',
    'networking-strategies-introverted-creatives',
    'How to build professional connections and find opportunities when networking doesn''t come naturally to you.',
    'Networking', 'David Thompson', '6 min read', false, true, '2025-04-01'::timestamptz
  ),
  (
    'From Freelancer to Agency: Growth Strategies',
    'freelancer-to-agency-growth-strategies',
    'The roadmap for scaling your solo creative practice into a thriving agency with a team and diverse client base.',
    'Business Growth', 'Emma Davis', '11 min read', false, true, '2025-03-25'::timestamptz
  ),
  (
    'Creative Collaboration in Remote Teams',
    'creative-collaboration-remote-teams',
    'Tools, techniques, and best practices for maintaining creative synergy when working with distributed teams.',
    'Remote Work', 'Marcus Chen', '9 min read', false, true, '2025-03-18'::timestamptz
  );
